import * as ko from "knockout";
import template from "./pictureEditor.html";
import { IViewManager } from '@paperbits/common/ui';
import { IWidgetEditor } from '@paperbits/common/widgets';
import { MediaContract } from "@paperbits/common/media";
import { Component } from "@paperbits/knockout/decorators/component";
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
    public readonly action: KnockoutObservable<string>;
    public readonly layout: KnockoutObservable<string>;
    public readonly animation: KnockoutObservable<string>;
    public readonly background: KnockoutObservable<BackgroundModel>;

    constructor(private viewManager: IViewManager) {
        this.onCaptionUpdate = this.onCaptionUpdate.bind(this);
        this.onLayoutUpdate = this.onLayoutUpdate.bind(this);
        this.onAnimationUpdate = this.onAnimationUpdate.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);

        this.caption = ko.observable<string>();
        this.caption.subscribe(this.onCaptionUpdate);

        this.action = ko.observable<string>();
        this.layout = ko.observable<string>();
        this.layout.subscribe(this.onLayoutUpdate);

        this.animation = ko.observable<string>();
        this.animation.subscribe(this.onAnimationUpdate);

        this.background = ko.observable();
    }

    private onCaptionUpdate(caption: string): void {
        this.pictureModel.caption = caption;
        this.applyChangesCallback();
    }

    private onLayoutUpdate(layout: string): void {
        this.pictureModel.layout = layout;
        this.applyChangesCallback();
    }

    private onAnimationUpdate(layout: string): void {
        this.pictureModel.animation = layout;
        this.applyChangesCallback();
    }

    public setWidgetModel(picture: PictureModel, applyChangesCallback?: () => void): void {
        this.pictureModel = picture;
        this.applyChangesCallback = applyChangesCallback;

        this.background(picture.background);
        this.caption(picture.caption);
        this.layout(picture.layout);
        this.animation(picture.animation);
    }

    public onMediaSelected(media: MediaContract): void {
        const background = new BackgroundModel();
        background.sourceKey = media.permalinkKey;
        background.sourceUrl = media.downloadUrl;
        background.size = "contain";
        background.position = "center center";

        this.pictureModel.background = background;
        this.background(background);

        this.applyChangesCallback();
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
