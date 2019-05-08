import * as ko from "knockout";
import template from "./settings.html";
import { Component } from "@paperbits/common/ko/decorators";
import { IViewManager } from "@paperbits/common/ui";
import { ISiteService, SettingsContract } from "@paperbits/common/sites";
import { IMediaService, MediaContract } from "@paperbits/common/media";
import { MetaDataSetter } from "@paperbits/common/meta";
import { BackgroundModel } from "@paperbits/common/widgets/background";

@Component({
    selector: "settings",
    template: template,
    injectable: "settingsWorkshop"
})
export class SettingsWorkshop {
    private readonly mediaService: IMediaService;
    private readonly siteService: ISiteService;
    private readonly viewManager: IViewManager;

    public readonly mimeType: string;
    public readonly working: ko.Observable<boolean>;

    public title: ko.Observable<string>;
    public description: ko.Observable<string>;
    public keywords: ko.Observable<string>;
    public hostname: ko.Observable<string>;
    public author: ko.Observable<string>;
    public gmapsApiKey: ko.Observable<string>;
    public googleFontsApiKey: ko.Observable<string>;
    public gtmContainerId: ko.Observable<string>;
    public intercomAppId: ko.Observable<string>;
    public faviconSourceKey: ko.Observable<string>;
    public faviconFileName: ko.Observable<string>;
    public favicon: ko.Observable<BackgroundModel>;


    constructor(mediaService: IMediaService, siteService: ISiteService, viewManager: IViewManager) {
        // initialization...
        this.mediaService = mediaService;
        this.siteService = siteService;
        this.viewManager = viewManager;

        // setting up...
        this.working = ko.observable<boolean>();
        this.mimeType = MetaDataSetter.iconContentType;

        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.keywords = ko.observable<string>();
        this.hostname = ko.observable<string>();
        this.author = ko.observable<string>();
        this.gmapsApiKey = ko.observable<string>();
        this.googleFontsApiKey = ko.observable<string>();
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
            this.faviconSourceKey(settings.site.faviconSourceKey);
            this.setFaviconUri(settings.site.faviconSourceKey);

            if (settings.integration) {
                if (settings.integration.googleMaps) {
                    this.gmapsApiKey(settings.integration.googleMaps.apiKey);
                }
                if (settings.integration.gtm) {
                    this.gtmContainerId(settings.integration.gtm.containerId);
                }
                if (settings.integration.intercom) {
                    this.intercomAppId(settings.integration.intercom.appId);
                }
                if (settings.integration.googleFonts) {
                    this.googleFontsApiKey(settings.integration.googleFonts.apiKey);
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
        this.googleFontsApiKey.subscribe(this.onSettingChange);
        this.gtmContainerId.subscribe(this.onSettingChange);
        this.intercomAppId.subscribe(this.onSettingChange);
        this.faviconSourceKey.subscribe(this.onSettingChange);
    }

    private async onSettingChange(): Promise<void> {
        const config: SettingsContract = {
            site: {
                title: this.title(),
                description: this.description(),
                keywords: this.keywords(),
                hostname: this.hostname(),
                faviconSourceKey: this.faviconSourceKey(),
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
                googleMaps: {
                    apiKey: this.gmapsApiKey()
                },
                googleFonts: {
                    apiKey: this.googleFontsApiKey()
                }
            }
        };

        await this.siteService.setSiteSettings(config);
    }

    public onMediaSelected(media: MediaContract): void {
        if (media) {
            this.faviconSourceKey(media.key);
            this.setFaviconUri(media.key);
        }
        else {
            this.faviconFileName(null);
            this.faviconSourceKey(null);
        }
    }

    private async setFaviconUri(sourceKey: string) {
        if (sourceKey) {
            return;
        }

        const mediaContract = await this.mediaService.getMediaByKey(sourceKey);

        if (!mediaContract) {
            console.warn(`Unable to fetch favicon by key ${sourceKey}`);
        }

        this.faviconFileName(mediaContract.downloadUrl);
        this.viewManager.loadFavIcon(mediaContract.downloadUrl);

        const faviconModel = new BackgroundModel();
        faviconModel.sourceUrl = mediaContract.downloadUrl;

        this.favicon(faviconModel);
    }
}