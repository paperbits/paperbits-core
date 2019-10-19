import * as ko from "knockout";
import template from "./role-input.html";
import { Component, Event, OnMounted, Param } from "@paperbits/common/ko/decorators";
import { RoleModel, RoleService } from "@paperbits/common/user";

@Component({
    selector: "role-input",
    template: template,
    injectable: "roleInput"
})
export class RoleInput {
    public readonly selectedRolesDisplay: ko.Observable<string>;
    public readonly availableRoles: ko.ObservableArray<RoleModel>;
    public readonly selectedRoles: ko.ObservableArray<RoleModel>;

    constructor(private readonly roleService: RoleService) {
        this.availableRoles = ko.observableArray();
        this.selectedRoles = ko.observableArray();
        this.selectedRolesDisplay = ko.observable();
    }

    @Param()
    public selection: string[];

    @Event()
    public readonly onChange: (role: string[]) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const availableRoles = await this.roleService.getRoles();
        this.availableRoles(availableRoles);

        if (!this.selection) {
            return;
        }

        const selectedRoles = availableRoles.filter(x => this.selection.includes(x.key));
        
        this.selectedRoles(selectedRoles);
        this.updateDisplay(selectedRoles);
    }

    private updateDisplay(roles: RoleModel[]): string {
        return this.selectedRolesDisplay(roles.map(x => x.name).sort().join(", "));
    }

    public onSelectionChange(roles: RoleModel[]): void {
        this.updateDisplay(roles);
        this.selectedRoles(roles);

        this.selection = roles.map(role => role.key);

        if (this.onChange) {
            console.log(this.selection);
            this.onChange(this.selection);
        }
    }
}