import * as ko from "knockout";
import template from "./localeEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { LocaleModel, LocaleService } from "@paperbits/common/localization";
import { builtInLocales } from "../locales";
import { EventManager } from "@paperbits/common/events";
import { ViewManager } from "@paperbits/common/ui";

@Component({
    selector: "locale-editor",
    template: template,
    injectable: "localeEditor"
})
export class LocaleEditor {
    public readonly languages: ko.Observable<any>;
    public readonly selectedLanguage: ko.Observable<any>;
    public readonly locales: ko.Observable<any>;
    public readonly selectedLocale: ko.Observable<any>;

    constructor(
        private readonly localeService: LocaleService,
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager
    ) {
        this.selectedLanguage = ko.observable();
        this.selectedLocale = ko.observable();

        this.locales = ko.observableArray();
        this.languages = ko.observable<any>(Object.keys(builtInLocales).map(code => {
            return {
                code: code,
                locales: builtInLocales[code].locales,
                displayName: builtInLocales[code].nameNative
            };
        }));
    }

    @Param()
    public locale: LocaleModel;

    @Event()
    public onLocaleAdded: (model: LocaleModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.selectedLanguage.subscribe(language => {
            this.locales(null);
            this.selectedLocale(null);

            if (!language.locales) {
                return;
            }

            this.locales(Object.keys(language.locales).map(x => {
                return {
                    code: x,
                    displayName: language.locales[x].nameNative
                };
            }));
        });
    }

    public async addLocale(): Promise<void> {
        const language = this.selectedLanguage();
        const locale = this.selectedLocale();

        let code = language.code;
        let displayName = language.displayName;

        if (locale) {
            code += "-" + locale.code;
            displayName += ` (${locale.displayName})`;
        }

        await this.localeService.createLocale(code, displayName);

        this.eventManager.dispatchEvent("onLocalesChange");

        if (this.onLocaleAdded) {
            this.onLocaleAdded(locale);
        }

        this.viewManager.notifySuccess("Content localization", `Locale "${displayName}" was  added.`);
    }
}