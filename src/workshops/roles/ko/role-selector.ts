import * as ko from "knockout";
import template from "./role-selector.html";
import { Component, Event, Param } from "@paperbits/common/ko/decorators";
import { BuiltInRoles, RoleModel } from "@paperbits/common/user";

@Component({
    selector: "role-selector",
    template: template,
    injectable: "roleSelector"
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

    private removeFromArray(array: RoleModel[], item: RoleModel): void {
        const index = array.indexOf(item);

        if (index < 0) {
            return;
        }

        array.splice(index, 1);
    }

    public selectRole(role: RoleModel): void {
        let roles = this.selectedRoles();

        if (role.key === BuiltInRoles.everyone.key) {
            roles = [BuiltInRoles.everyone];
        }
        else {
            this.removeFromArray(roles, BuiltInRoles.everyone);

            if (roles.includes(role)) {
                this.removeFromArray(roles, role);
            }
            else {
                roles.push(role);
            }
        }

        if (roles.length === 0) {
            // Skipping update, at least one role must be selected.
            return;
        }

        this.selectedRoles(roles);

        if (this.onSelect) {
            this.onSelect(roles);
        }
    }

    public isSelected(role: RoleModel): boolean {
        return this.selectedRoles().some(x => x.key === role.key);
    }
}