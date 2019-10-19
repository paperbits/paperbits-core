import * as ko from "knockout";
import template from "./tray.html";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { IToolButton, IViewManager } from "@paperbits/common/ui";
import { RoleModel, RoleService } from "@paperbits/common/user";


@Component({
    selector: "tray",
    template: template,
    injectable: "tray"
})
export class Tray {
    public readonly buttons: ko.ObservableArray<IToolButton>;
    public readonly selectedRoles: ko.ObservableArray<RoleModel>;
    public readonly availableRoles: ko.ObservableArray<RoleModel>;

    constructor(
        private readonly trayCommands: IToolButton[],
        private readonly roleService: RoleService,
        private readonly viewManager: IViewManager,
    ) {
        this.buttons = ko.observableArray<IToolButton>(trayCommands);
        this.availableRoles = ko.observableArray();
        this.selectedRoles = ko.observableArray();
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.buttons(this.trayCommands);
        this.availableRoles(await this.roleService.getRoles());
        this.selectedRoles(this.viewManager.getViewRoles());
    }

    public onRoleSelect(roles: RoleModel[]): void {
        this.selectedRoles(roles);
        this.viewManager.setViewRoles(roles);
    }
}