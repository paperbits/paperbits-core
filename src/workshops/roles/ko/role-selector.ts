import * as ko from "knockout";
import template from "./role-selector.html";
import { Component, Event, Param } from "@paperbits/common/ko/decorators";
import { RoleModel } from "@paperbits/common/user";

@Component({
    selector: "role-selector",
    template: template
})
export class RoleSelector {
    constructor() {
        this.availableRoles = ko.observableArray();
        this.selectedRoles = ko.observableArray();
    }

    @Param()
    public availableRoles: ko.ObservableArray<RoleModel>;

    @Param()
    public selectedRoles: ko.ObservableArray<RoleModel>;

    @Event()
    public readonly onSelect: (role: RoleModel[]) => void;

    public selectRole(role: RoleModel): void {
        const roles = [role]; // TODO: Adjust if multiple roles need to be applied.

        this.selectedRoles(roles);

        if (this.onSelect) {
            this.onSelect(roles);
        }
    }

    public isSelected(role: RoleModel): boolean {
        return this.selectedRoles().some(x => x.key === role.key);
    }
}