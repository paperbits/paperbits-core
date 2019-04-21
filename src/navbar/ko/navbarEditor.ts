import * as ko from "knockout";
import template from "./navbarEditor.html";
import { MediaContract, MediaService } from "@paperbits/common/media";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { NavbarModel } from "../navbarModel";
import { NavigationItemContract } from "@paperbits/common/navigation";
import { NavbarModelBinder } from "../navbarModelBinder";

@Component({
    selector: "navbar-editor",
    template: template,
    injectable: "navbarEditor"
})
export class NavbarEditor {
    public readonly pictureUrl: ko.Observable<string>;
    public readonly navigationItemTitle: ko.Observable<string>;
    public readonly width: ko.Observable<number>;
    public readonly height: ko.Observable<number>;

    constructor(
        private readonly navbarModelBinder: NavbarModelBinder,
        private readonly mediaService: MediaService
    ) {
        this.initialize = this.initialize.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.onNavigationItemChange = this.onNavigationItemChange.bind(this);
        this.pictureUrl = ko.observable<string>();
        this.width = ko.observable<number>();
        this.height = ko.observable<number>();

        this.navigationItemTitle = ko.observable<string>("Click to select navigation item...");
    }

    @Param()
    public model: NavbarModel;

    @Event()
    public onChange: (model: NavbarModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        if (this.model.pictureSourceKey) {
            const media = await this.mediaService.getMediaByKey(this.model.pictureSourceKey);

            if (media) {
                this.pictureUrl(`url(${media.downloadUrl})`);
            }
        }

        this.width.subscribe(this.applyChanges);
        this.height.subscribe(this.applyChanges);
    }

    private applyChanges(): void {
        this.model.pictureWidth = this.width();
        this.model.pictureHeight = this.height();
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