import * as ko from "knockout";
import template from "./tray.html";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { ToolButton, ViewManager } from "@paperbits/common/ui";
import { ISettingsProvider } from "@paperbits/common/configuration";


@Component({
    selector: "tray",
    template: template
})
export class Tray {
    public readonly buttons: ko.ObservableArray<ToolButton>;
    public readonly localizationEnabled: ko.Observable<boolean>;

    constructor(
        private readonly trayCommands: ToolButton[],
        private readonly settingsProvider: ISettingsProvider
    ) {
        this.buttons = ko.observableArray<ToolButton>(trayCommands);
        this.localizationEnabled = ko.observable();
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.buttons(this.trayCommands);
        const localizationEnabled = await this.settingsProvider.getSetting<boolean>("features/localization");
        this.localizationEnabled(!!localizationEnabled);
    }
}