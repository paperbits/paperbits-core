import * as ko from "knockout";
import template from "./locale-selector.html";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { EventManager } from "@paperbits/common/events";
import { LocaleModel, ILocaleService } from "@paperbits/common/localization";
import { ViewManager, View } from "@paperbits/common/ui";

@Component({
    selector: "locale-selector",
    template: template,
    injectable: "localeSelector"
})
export class LocaleSelector {
    public readonly selectedLocale: ko.Observable<LocaleModel>;
    public readonly locales: ko.ObservableArray<LocaleModel>;

    constructor(
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly localeService: ILocaleService
    ) {
        this.selectedLocale = ko.observable();
        this.locales = ko.observableArray();
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.refreshLocales();
        this.eventManager.addEventListener("onLocalesChange", this.refreshLocales);
    }

    private async refreshLocales(): Promise<void> {
        const locales = await this.localeService.getLocales();
        const currentLocaleCode = await this.localeService.getCurrentLocaleCode();

        this.locales(locales);
        this.selectedLocale(locales.find(x => x.code === currentLocaleCode));
    }

    public selectLocale(locale: LocaleModel): void {
        this.viewManager.clearJourney();
        this.localeService.setCurrentLocale(locale.code);
        this.eventManager.dispatchEvent("onLocaleChange", locale);
        this.selectedLocale(locale);
    }

    public async addLocale(): Promise<void> {
        const view: View = {
            heading: "Add locale",
            component: {
                name: "locale-editor",
                params: {
                    onLocaleAdded: async (locale: LocaleModel) => {
                        await this.localeService.setCurrentLocale(locale.code);
                        await this.refreshLocales();
                        this.viewManager.closeView();

                        this.eventManager.dispatchEvent("onLocaleChange");
                    }
                }
            },
            resize: "vertically horizontally"
        };

        this.viewManager.openViewAsPopup(view);
    }
}