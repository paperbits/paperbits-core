import * as ko from "knockout";
import template from "./popupDetails.html";
import * as Utils from "@paperbits/common/utils";
import { IPopupService } from "@paperbits/common/popups";
import { Router } from "@paperbits/common/routing";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { PopupItem } from "./popupItem";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { ILocaleService } from "@paperbits/common/localization";
import { EventManager, Events } from "@paperbits/common/events";

@Component({
    selector: "popup-details-workshop",
    template: template
})
export class PopupDetailsWorkshop {
    public readonly isReserved: ko.Observable<boolean>;
    public readonly isSeoEnabled: ko.Observable<boolean>;
    public readonly socialShareImage: ko.Observable<BackgroundModel>;

    constructor(
        private readonly popupService: IPopupService,
        private readonly router: Router,
        private readonly viewManager: ViewManager,
        private readonly reservedPermalinks: string[],
        private readonly localeService: ILocaleService,
        private readonly eventManager: EventManager
    ) {
        this.isReserved = ko.observable(false);
        this.isSeoEnabled = ko.observable(false);
        this.socialShareImage = ko.observable();
    }

    @Param()
    public popupItem: PopupItem;

    @Event()
    private readonly onDeleteCallback: () => void;

    @Event()
    private readonly onCopyCallback: (popupItem: PopupItem) => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.popupItem.title
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.applyChanges);

        this.popupItem.description
            .subscribe(this.applyChanges);

        let validPermalink = this.popupItem.permalink;

        if (this.reservedPermalinks.includes(this.popupItem.permalink())) {
            this.isReserved(true);
        }
        else {
            validPermalink = validPermalink.extend(<any>{ required: true, isValidPopup: true, onlyValid: true });
            validPermalink.subscribe(this.applyChanges);
        }

        const locale = await this.localeService.getCurrentLocaleCode();
        const defaultLocale = await this.localeService.getDefaultLocaleCode();

        if (locale !== defaultLocale) {
            this.isReserved(true);
        }
    }

    public openPopup(): void {
        const hostDocument = this.viewManager.getHostDocument();
        hostDocument.dispatchEvent(new CustomEvent(Events.PopupRequest, { detail: this.popupItem.key }));

        this.viewManager.clearContextualCommands();
        this.viewManager.clearJourney();
        this.viewManager.closeView();

        this.eventManager.dispatchEvent(Events.HintRequest, {
            key: "4de8",
            content: `You can open a popup anytime by clicking on its trigger holding Ctrl (Windows) or ⌘ (Mac) key.`
        });
    }

    private async applyChanges(): Promise<void> {
        await this.popupService.updatePopup(this.popupItem.toContract());
    }

    public async deletePopup(): Promise<void> {
        await this.popupService.deletePopup(this.popupItem.toContract());

        this.viewManager.notifySuccess("Popups", `Popup "${Utils.truncate(this.popupItem.title(), 50)}" was deleted.`);
        this.viewManager.closeWorkshop("popup-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }

        this.router.navigateTo("/");
    }

    public async copyPopup(): Promise<void> {
        const copiedPopup = await this.popupService.copyPopup(this.popupItem.key);

        if (this.onCopyCallback) {
            this.onCopyCallback(new PopupItem(copiedPopup));
        }
    }
}