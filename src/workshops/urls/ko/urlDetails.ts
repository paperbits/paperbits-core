import * as ko from "knockout";
import template from "./urlDetails.html";
import * as Utils from "@paperbits/common/utils";
import { IUrlService } from "@paperbits/common/urls";
import { Router } from "@paperbits/common/routing";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { UrlItem } from "./urlItem";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { ILocaleService } from "@paperbits/common/localization";

@Component({
    selector: "url-details-workshop",
    template: template
})
export class UrlDetailsWorkshop {
    public readonly isReserved: ko.Observable<boolean>;
    public readonly isSeoEnabled: ko.Observable<boolean>;
    public readonly socialShareImage: ko.Observable<BackgroundModel>;

    constructor(
        private readonly urlService: IUrlService,
        private readonly router: Router,
        private readonly viewManager: ViewManager,
        private readonly reservedPermalinks: string[],
        private readonly localeService: ILocaleService
    ) {
        this.isReserved = ko.observable(false);
        this.isSeoEnabled = ko.observable(false);
        this.socialShareImage = ko.observable();
    }

    @Param()
    public urlItem: UrlItem;

    @Event()
    private readonly onDeleteCallback: () => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.urlItem.title
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.applyChanges);

        this.urlItem.description
            .subscribe(this.applyChanges);

        let validPermalink = this.urlItem.permalink;

        if (this.reservedPermalinks.includes(this.urlItem.permalink())) {
            this.isReserved(true);
        }
        else {
            validPermalink = validPermalink.extend(<any>{ required: true, isValidUrl: true, onlyValid: true });
            validPermalink.subscribe(this.applyChanges);
        }

        const locale = await this.localeService.getCurrentLocaleCode();
        const defaultLocale = await this.localeService.getDefaultLocaleCode();

        if (locale !== defaultLocale) {
            this.isReserved(true);
        }
    }

    private async applyChanges(): Promise<void> {
        await this.urlService.updateUrl(this.urlItem.toContract());
    }

    public async deleteUrl(): Promise<void> {
        await this.urlService.deleteUrl(this.urlItem.toContract());

        this.viewManager.notifySuccess("URLs", `URL "${Utils.truncate(this.urlItem.title(), 50)}" was deleted.`);
        this.viewManager.closeWorkshop("url-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }

        this.router.navigateTo("/");
    }
}