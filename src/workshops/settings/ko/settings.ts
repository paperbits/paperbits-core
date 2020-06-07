import * as ko from "knockout";
import template from "./settings.html";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { ISiteService, SiteSettingsContract } from "@paperbits/common/sites";
import { IMediaService, MediaContract } from "@paperbits/common/media";
import { MetaDataSetter } from "@paperbits/common/meta/metaDataSetter";
import { BackgroundModel } from "@paperbits/common/widgets/background";

@Component({
    selector: "settings",
    template: template
})
export class SettingsWorkshop {
    public readonly working: ko.Observable<boolean>;
    public readonly title: ko.Observable<string>;
    public readonly description: ko.Observable<string>;
    public readonly keywords: ko.Observable<string>;
    public readonly hostname: ko.Observable<string>;
    public readonly author: ko.Observable<string>;
    public readonly faviconSourceKey: ko.Observable<string>;
    public readonly faviconFileName: ko.Observable<string>;
    public readonly favicon: ko.Observable<BackgroundModel>;


    constructor(
        private readonly mediaService: IMediaService,
        private readonly siteService: ISiteService
    ) {
        this.working = ko.observable<boolean>();
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.keywords = ko.observable<string>();
        this.hostname = ko.observable<string>();
        this.author = ko.observable<string>();
        this.faviconSourceKey = ko.observable<string>();
        this.faviconFileName = ko.observable<string>();
        this.favicon = ko.observable<BackgroundModel>();
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.working(true);

        const settings = await this.siteService.getSettings<any>();
        const siteSettings: SiteSettingsContract = settings.site;

        if (siteSettings) {
            this.title(siteSettings.title);
            this.description(siteSettings.description);
            this.keywords(siteSettings.keywords);
            this.hostname(siteSettings.hostname);
            this.author(siteSettings.author);
            this.faviconSourceKey(siteSettings.faviconSourceKey);
            this.setFaviconUri(siteSettings.faviconSourceKey);
        }
        this.working(false);

        this.title.subscribe(this.onSettingChange);
        this.description.subscribe(this.onSettingChange);
        this.keywords.subscribe(this.onSettingChange);
        this.hostname.subscribe(this.onSettingChange);
        this.author.subscribe(this.onSettingChange);
        this.faviconSourceKey.subscribe(this.onSettingChange);
    }

    private async onSettingChange(): Promise<void> {
        const settings = await this.siteService.getSettings<any>();

        const siteSettings: SiteSettingsContract = {
            title: this.title(),
            description: this.description(),
            keywords: this.keywords(),
            hostname: this.hostname(),
            faviconSourceKey: this.faviconSourceKey(),
            author: this.author()
        };

        settings.site = siteSettings;

        await this.siteService.setSettings(settings);
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

    private async setFaviconUri(sourceKey: string): Promise<void> {
        if (!sourceKey) {
            return;
        }

        const mediaContract = await this.mediaService.getMediaByKey(sourceKey);

        if (!mediaContract) {
            console.warn(`Unable to fetch favicon by key ${sourceKey}.`);
            return;
        }

        this.faviconFileName(mediaContract.downloadUrl);
        MetaDataSetter.setFavIcon(mediaContract.downloadUrl);

        const faviconModel = new BackgroundModel();
        faviconModel.sourceUrl = mediaContract.downloadUrl;

        this.favicon(faviconModel);
    }
}