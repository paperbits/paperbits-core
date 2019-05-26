import * as ko from "knockout";
import template from "./navbarEditor.html";
import { MediaContract, MediaService } from "@paperbits/common/media";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { NavbarModel } from "../navbarModel";
import { NavigationItemContract } from "@paperbits/common/navigation";
import { NavbarModelBinder } from "../navbarModelBinder";
import { StyleService } from "@paperbits/styles/styleService";

@Component({
    selector: "navbar-editor",
    template: template,
    injectable: "navbarEditor"
})
export class NavbarEditor {
    public readonly pictureUrl: ko.Observable<string>;
    public readonly navigationItemTitle: ko.Observable<string>;
    public readonly pictureWidth: ko.Observable<string | number>;
    public readonly pictureHeight: ko.Observable<string | number>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;

    constructor(
        private readonly navbarModelBinder: NavbarModelBinder,
        private readonly mediaService: MediaService,
        private readonly styleService: StyleService
    ) {
        this.initialize = this.initialize.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.onNavigationItemChange = this.onNavigationItemChange.bind(this);
        this.pictureUrl = ko.observable<string>();
        this.pictureWidth = ko.observable<string | number>();
        this.pictureHeight = ko.observable<string | number>();
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();

        this.navigationItemTitle = ko.observable<string>("Click to select navigation item...");
    }

    @Param()
    public model: NavbarModel;

    @Event()
    public onChange: (model: NavbarModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const variations = await this.styleService.getComponentVariations("navbar");

        this.appearanceStyles(variations.filter(x => x.category === "appearance"));

        if (this.model.styles) {
            this.appearanceStyle(this.model.styles.appearance);
        }

        if (this.model.pictureSourceKey) {
            const media = await this.mediaService.getMediaByKey(this.model.pictureSourceKey);

            if (media) {
                this.pictureUrl(`url(${media.downloadUrl})`);
                this.pictureWidth(this.model.pictureWidth);
                this.pictureHeight(this.model.pictureHeight);
            }
        }

        this.pictureWidth.subscribe(this.applyChanges);
        this.pictureHeight.subscribe(this.applyChanges);
        this.appearanceStyle.subscribe(this.applyChanges);
    }

    private applyChanges(): void {
        this.model.pictureWidth = this.pictureWidth();
        this.model.pictureHeight = this.pictureHeight();
        this.model.styles = {
            appearance: this.appearanceStyle()
        };
        this.onChange(this.model);
    }

    public onMediaSelected(media: MediaContract): void {
        if (media) {
            this.model.pictureSourceKey = media.key;
            this.model.pictureSourceUrl = media.downloadUrl;
            this.pictureUrl(`url(${media.downloadUrl})`);
        }
        else {
            this.model.pictureSourceKey = undefined;
            this.model.pictureSourceUrl = undefined;
            this.pictureUrl(undefined);
        }

        this.onChange(this.model);
    }

    public async onNavigationItemChange(navigationItem: NavigationItemContract): Promise<void> {
        this.model.rootKey = navigationItem.key;
        this.model.root = await this.navbarModelBinder.navigationItemToNavbarItemModel(navigationItem);
        this.navigationItemTitle(navigationItem.label);

        this.onChange(this.model);
    }
}