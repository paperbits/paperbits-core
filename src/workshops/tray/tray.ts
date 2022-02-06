import * as ko from "knockout";
import template from "./tray.html";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { ToolButton, ViewManager } from "@paperbits/common/ui";
import { RoleModel, RoleService } from "@paperbits/common/user";
import { ISettingsProvider } from "@paperbits/common/configuration";


@Component({
    selector: "tray",
    template: template
})
export class Tray {
    public readonly buttons: ko.ObservableArray<ToolButton>;
    public readonly selectedRoles: ko.ObservableArray<RoleModel>;
    public readonly availableRoles: ko.ObservableArray<RoleModel>;
    public readonly localizationEnabled: ko.Observable<boolean>;

    constructor(
        private readonly trayCommands: ToolButton[],
        private readonly roleService: RoleService,
        private readonly viewManager: ViewManager,
        private readonly settingsProvider: ISettingsProvider
    ) {
        this.buttons = ko.observableArray<ToolButton>(trayCommands);
        this.availableRoles = ko.observableArray();
        this.selectedRoles = ko.observableArray();
        this.localizationEnabled = ko.observable();
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.buttons(this.trayCommands);
        const roles = await this.roleService.getRoles();
        this.availableRoles(roles.slice(1)); // Excluding Everyone.
        this.selectedRoles(this.viewManager.getViewRoles());

        const localizationEnabled = await this.settingsProvider.getSetting<boolean>("features/localization");
        this.localizationEnabled(!!localizationEnabled);
    }

    public onRoleSelect(roles: RoleModel[]): void {
        this.selectedRoles(roles);
        this.viewManager.setViewRoles(roles);
    }
}