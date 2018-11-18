import * as ko from "knockout";
import template from "./settings.html";
import { Component } from "@paperbits/common/ko/decorators";
import { IViewManager } from "@paperbits/common/ui";
import { ISiteService, ISettings } from "@paperbits/common/sites";
import { IMediaService, IMediaFilter, MediaContract } from "@paperbits/common/media";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { MetaDataSetter } from "@paperbits/common/meta";
import { BackgroundModel } from "@paperbits/common/widgets/background";

@Component({
    selector: "settings",
    template: template,
    injectable: "settingsWorkshop"
})
export class SettingsWorkshop {
    private readonly mediaService: IMediaService;
    private readonly permalinkService: IPermalinkService;
    private readonly siteService: ISiteService;
    private readonly viewManager: IViewManager;

    public readonly mediaFilter: IMediaFilter;
    public readonly working: KnockoutObservable<boolean>;

    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public hostname: KnockoutObservable<string>;
    public author: KnockoutObservable<string>;
    public gmapsApiKey: KnockoutObservable<string>;
    public gtmContainerId: KnockoutObservable<string>;
    public intercomAppId: KnockoutObservable<string>;
    public faviconSourceKey: KnockoutObservable<string>;
    public faviconFileName: KnockoutObservable<string>;
    public favicon: KnockoutObservable<BackgroundModel>;


    constructor(mediaService: IMediaService, permalinkService: IPermalinkService, siteService: ISiteService, viewManager: IViewManager) {
        // initialization...
        this.mediaService = mediaService;
        this.permalinkService = permalinkService;
        this.siteService = siteService;
        this.viewManager = viewManager;

        // rebinding...     
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.onSettingChange = this.onSettingChange.bind(this);

        // setting up...
        this.working = ko.observable<boolean>();
        this.mediaFilter = {
            propertyNames: ["contentType"],
            propertyValue: MetaDataSetter.iconContentType,
            startSearch: true
        };

        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.keywords = ko.observable<string>();
        this.hostname = ko.observable<string>();
        this.author = ko.observable<string>();
        this.gmapsApiKey = ko.observable<string>();
        this.gtmContainerId = ko.observable<string>();
        this.intercomAppId = ko.observable<string>();
        this.faviconSourceKey = ko.observable<string>();
        this.faviconFileName = ko.observable<string>();
        this.favicon = ko.observable<BackgroundModel>();

        this.loadSettings();
    }

    private async loadSettings(): Promise<void> {
        this.working(true);

        const settings = await this.siteService.getSiteSettings();

        if (settings) {
            this.title(settings.site.title);
            this.description(settings.site.description);
            this.keywords(settings.site.keywords);
            this.hostname(settings.site.hostname);
            this.author(settings.site.author);
            this.faviconSourceKey(settings.site.faviconPermalinkKey);
            this.setFaviconUri(settings.site.faviconPermalinkKey);

            if (settings.integration) {
                if (settings.integration.googlemaps) {
                    this.gmapsApiKey(settings.integration.googlemaps.apiKey);
                }
                if (settings.integration.gtm) {
                    this.gtmContainerId(settings.integration.gtm.containerId);
                }
                if (settings.integration.intercom) {
                    this.intercomAppId(settings.integration.intercom.appId);
                }
            }
        }
        this.working(false);

        this.title.subscribe(this.onSettingChange);
        this.description.subscribe(this.onSettingChange);
        this.keywords.subscribe(this.onSettingChange);
        this.hostname.subscribe(this.onSettingChange);
        this.author.subscribe(this.onSettingChange);
        this.gmapsApiKey.subscribe(this.onSettingChange);
        this.gtmContainerId.subscribe(this.onSettingChange);
        this.intercomAppId.subscribe(this.onSettingChange);
        this.faviconSourceKey.subscribe(this.onSettingChange);
    }

    private async onSettingChange(): Promise<void> {
        const config: ISettings = {
            site: {
                title: this.title(),
                description: this.description(),
                keywords: this.keywords(),
                hostname: this.hostname(),
                faviconPermalinkKey: this.faviconSourceKey(),
                author: this.author()
            },
            integration: {
                intercom: {
                    appId: this.intercomAppId()
                },
                gtm: {
                    containerId: this.gtmContainerId(),
                    dataLayerName: this.gtmContainerId()
                },
                googlemaps: {
                    apiKey: this.gmapsApiKey()
                }
            }
        };

        await this.siteService.setSiteSettings(config);
        await this.viewManager.setTitle(config, null);
    }

    public onMediaSelected(media: MediaContract): void {
        if (media) {
            this.faviconSourceKey(media.permalinkKey);
            this.setFaviconUri(media.permalinkKey);
        }
        else {
            this.faviconFileName(null);
            this.faviconSourceKey(null);
        }
    }

    private async setFaviconUri(permalinkKey: string) {
        if (permalinkKey) {
            const faviconPermalink = await this.permalinkService.getPermalinkByKey(permalinkKey);

            if (faviconPermalink) {
                this.faviconFileName(faviconPermalink.uri);
                this.viewManager.loadFavIcon();

                const faviconModel = new BackgroundModel();
                const faviconMedia = await this.mediaService.getMediaByKey(faviconPermalink.targetKey);

                faviconModel.sourceUrl = faviconMedia.downloadUrl;

                this.favicon(faviconModel);
            }
        }
    }
}