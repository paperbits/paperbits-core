import * as ko from "knockout";
import template from "./pictureEditor.html";
import { MediaContract } from "@paperbits/common/media";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { PictureModel } from "../pictureModel";


@Component({
    selector: "paperbits-picture-editor",
    template: template,
    injectable: "pictureEditor"
})
export class PictureEditor {
    public readonly caption: ko.Observable<string>;
    public readonly layout: ko.Observable<string>;
    public readonly animation: ko.Observable<string>;
    public readonly background: ko.Observable<BackgroundModel>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly hyperlinkTitle: ko.Computed<string>;
    public readonly width: ko.Observable<number>;
    public readonly height: ko.Observable<number>;

    constructor() {
        this.caption = ko.observable<string>();
        this.layout = ko.observable<string>();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.animation = ko.observable<string>();
        this.width = ko.observable<number>();
        this.height = ko.observable<number>();
        this.background = ko.observable();
        this.hyperlinkTitle = ko.computed<string>(() => this.hyperlink() ? this.hyperlink().title : "Add a link...");
    }

    @Param()
    public model: PictureModel;

    @Event()
    public onChange: (model: PictureModel) => void;

    @OnMounted()
    public initialize(): void {
        this.background(this.model.background);
        this.caption(this.model.caption);
        this.layout(this.model.layout);
        this.animation(this.model.animation);
        this.hyperlink(this.model.hyperlink);
        this.width(this.model.width);
        this.height(this.model.height);

        this.caption.subscribe(this.applyChanges);
        this.layout.subscribe(this.applyChanges);
        this.hyperlink.subscribe(this.applyChanges);
        this.animation.subscribe(this.applyChanges);
        this.width.subscribe(this.applyChanges);
        this.height.subscribe(this.applyChanges);
    }

    public applyChanges(): void {
        this.model.caption = this.caption();
        this.model.layout = this.layout();
        this.model.hyperlink = this.hyperlink();
        this.model.animation = this.animation();
        this.model.background = this.background();
        this.model.width = this.width();
        this.model.height = this.height();

        this.onChange(this.model);
    }

    public onMediaSelected(media: MediaContract): void {
        if (!media) {
            this.background(null);
        }
        else {
            const background = new BackgroundModel(); // TODO: Let's use proper model here
            background.sourceKey = media.key;
            background.sourceUrl = media.downloadUrl;
            background.size = "contain";
            background.position = "center center";
            this.background(background);
        }

        this.applyChanges();
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);
        this.applyChanges();
    }
}
