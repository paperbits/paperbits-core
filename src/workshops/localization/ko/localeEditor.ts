import * as ko from "knockout";
import template from "./localeEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { LocaleModel, LocaleService } from "@paperbits/common/localization";
import { builtInLocales } from "../locales";
import { EventManager } from "@paperbits/common/events";
import { ViewManager } from "@paperbits/common/ui";


interface LocaleContract {
    code: string;
    displayName: string;
}

interface LanguageContract {
    code: string;
    locales: LocaleContract[];
    direction: string;
    displayName: string;
}

@Component({
    selector: "locale-editor",
    template: template,
    injectable: "localeEditor"
})
export class LocaleEditor {
    public readonly languages: ko.Observable<LanguageContract>;
    public readonly selectedLanguage: ko.Observable<LanguageContract>;
    public readonly locales: ko.Observable<LocaleContract[]>;
    public readonly selectedLocale: ko.Observable<LocaleContract>;

    constructor(
        private readonly localeService: LocaleService,
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager
    ) {
        this.selectedLanguage = ko.observable();
        this.selectedLocale = ko.observable();

        this.locales = ko.observableArray();
        this.languages = ko.observable<any>(Object.keys(builtInLocales).map<LanguageContract>(code => {
            const builtInLocale = builtInLocales[code];

            return {
                code: code,
                locales: builtInLocale.locales,
                direction: builtInLocale.direction,
                displayName: builtInLocale.nameNative
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
        const location = this.selectedLocale();

        let code = language.code;
        let displayName = language.displayName;
        const direction = language.direction;

        if (location) {
            code += "-" + location.code;
            displayName += ` (${location.displayName})`;
        }

        const locale = await this.localeService.createLocale(code, displayName, direction);

        if (this.onLocaleAdded) {
            this.onLocaleAdded(locale);
        }

        this.eventManager.dispatchEvent("onLocalesChange");

        this.viewManager.notifySuccess("Content localization", `Locale "${displayName}" was  added.`);
    }
}