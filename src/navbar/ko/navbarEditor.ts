import * as ko from "knockout";
import template from "./navbarEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { Component } from "@paperbits/knockout/decorators/component";
import { NavbarModel } from "../navbarModel";

@Component({
    selector: "navbar-editor",
    template: template,
    injectable: "navbarEditor"
})
export class NavbarEditor implements IWidgetEditor {
    private navbarModel: NavbarModel;
    private applyChangesCallback?: () => void;

    public background: KnockoutObservable<BackgroundModel>;

    constructor(private viewManager: IViewManager) {
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.background = ko.observable<BackgroundModel>();
    }

    public setWidgetModel(navbarModel: NavbarModel, applyChangesCallback?: () => void): void {
        this.navbarModel = navbarModel;
        this.applyChangesCallback = applyChangesCallback;
    }

    private onChange(): void {
        if (!this.applyChangesCallback) {
            return;
        }

        this.applyChangesCallback();
    }

    public onMediaSelected(media: MediaContract): void {
        this.navbarModel.pictureSourceKey = media.permalinkKey;
        this.navbarModel.pictureSourceUrl = media.downloadUrl;

        this.applyChangesCallback();

        const backgroundModel = new BackgroundModel();
        backgroundModel.sourceUrl = media.downloadUrl;

        this.background(backgroundModel);
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}