import * as ko from "knockout";
import template from "./navbarEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets";
import { MediaContract } from "@paperbits/common/media";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { Component } from "@paperbits/common/ko/decorators";
import { NavbarModel } from "../navbarModel";
import { NavigationItemContract } from "@paperbits/common/navigation";
import { NavbarModelBinder } from "../navbarModelBinder";

@Component({
    selector: "navbar-editor",
    template: template,
    injectable: "navbarEditor"
})
export class NavbarEditor implements IWidgetEditor {
    private navbarModel: NavbarModel;
    private applyChangesCallback?: () => void;

    public background: KnockoutObservable<BackgroundModel>;
    public readonly navigationItemTitle: KnockoutObservable<string>;

    constructor(private readonly navbarModelBinder: NavbarModelBinder) {
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.onNavigationItemChange = this.onNavigationItemChange.bind(this);
        this.background = ko.observable<BackgroundModel>();

        this.navigationItemTitle = ko.observable<string>("Click to select navigation item...");
    }

    public setWidgetModel(navbarModel: NavbarModel, applyChangesCallback?: () => void): void {
        this.navbarModel = navbarModel;
        this.applyChangesCallback = applyChangesCallback;
    }

    public onMediaSelected(media: MediaContract): void {
        this.navbarModel.pictureSourceKey = media.permalinkKey;
        this.navbarModel.pictureSourceUrl = media.downloadUrl;

        this.applyChangesCallback();

        const backgroundModel = new BackgroundModel();
        backgroundModel.sourceUrl = media.downloadUrl;

        this.background(backgroundModel);
    }

    public async onNavigationItemChange(navigationItem: NavigationItemContract): Promise<void> {
        this.navbarModel.rootKey = navigationItem.key;
        this.navbarModel.root =  await this.navbarModelBinder.navigationItemToNavbarItemModel(navigationItem);
        this.navigationItemTitle(navigationItem.label);
        this.applyChangesCallback();
    }
}