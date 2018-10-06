import * as ko from "knockout";
import template from "./pictureEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets";
import { MediaContract } from "@paperbits/common/media";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Component } from "../../ko/decorators/component.decorator";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { PictureModel } from "../pictureModel";


@Component({
    selector: "paperbits-picture-editor",
    template: template,
    injectable: "pictureEditor"
})
export class PictureEditor implements IWidgetEditor {
    private pictureModel: PictureModel;
    private applyChangesCallback: () => void;

    public readonly caption: KnockoutObservable<string>;
    public readonly layout: KnockoutObservable<string>;
    public readonly animation: KnockoutObservable<string>;
    public readonly background: KnockoutObservable<BackgroundModel>;
    public readonly hyperlink: KnockoutObservable<HyperlinkModel>;
    public readonly hyperlinkTitle: KnockoutComputed<string>;
    public readonly width: KnockoutObservable<number>;
    public readonly height: KnockoutObservable<number>;

    constructor() {
        this.onHyperlinkChange = this.onHyperlinkChange.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.onChange = this.onChange.bind(this);

        this.caption = ko.observable<string>();
        this.caption.subscribe(this.onChange);

        this.layout = ko.observable<string>();
        this.layout.subscribe(this.onChange);

        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlink.subscribe(this.onChange);

        this.animation = ko.observable<string>();
        this.animation.subscribe(this.onChange);

        this.width = ko.observable<number>();
        this.width.subscribe(this.onChange);

        this.height = ko.observable<number>();
        this.height.subscribe(this.onChange);

        this.hyperlinkTitle = ko.computed<string>(() => {
            return this.hyperlink() ? this.hyperlink().title : "Add a link...";
        });

        this.background = ko.observable();
    }

    public setWidgetModel(picture: PictureModel, applyChangesCallback?: () => void): void {
        this.pictureModel = picture;
        this.background(picture.background);
        this.caption(picture.caption);
        this.layout(picture.layout);
        this.animation(picture.animation);
        this.hyperlink(picture.hyperlink);
        this.width(picture.width);
        this.height(picture.height);

        this.applyChangesCallback = applyChangesCallback;
    }

    public onChange(): void {
        if (!this.applyChangesCallback) {
            return;
        }

        this.pictureModel.caption = this.caption();
        this.pictureModel.layout = this.layout();
        this.pictureModel.hyperlink = this.hyperlink();
        this.pictureModel.animation = this.animation();
        this.pictureModel.background = this.background();
        this.pictureModel.width = this.width();
        this.pictureModel.height = this.height();

        this.applyChangesCallback();
    }

    public onMediaSelected(media: MediaContract): void {
        const background = new BackgroundModel(); // TODO: Let's use proper model here
        background.sourceKey = media.permalinkKey;
        background.sourceUrl = media.downloadUrl;
        background.size = "contain";
        background.position = "center center";

        // TODO: use window.devicePixelRatio to assign sizes

        this.background(background);
        this.onChange();
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);
        this.onChange();
    }
}
