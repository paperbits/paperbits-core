import * as ko from "knockout";
import template from "./roleBasedSecurityModelEditor.html";
import { Component, Event, OnMounted, Param } from "@paperbits/common/ko/decorators";
import { BuiltInRoles, RoleModel, RoleService } from "@paperbits/common/user";
import { RoleBasedSecurityModel } from "@paperbits/common/security/roleBasedSecurityModel";
import { ISecurityModelEditor } from "../../../security/ISecurityModelEditor";

@Component({
    selector: "role-based-security-model-editor",
    template: template,
})
export class RoleBasedSecurityModelEditor implements ISecurityModelEditor<RoleBasedSecurityModel> {
    constructor(private readonly roleService: RoleService) {
        this.availableRoles = ko.observableArray();
        this.selectedRoles = ko.observableArray();
    }

    @Param()
    public securityModel: RoleBasedSecurityModel;

    public availableRoles: ko.ObservableArray<RoleModel>;

    public selectedRoles: ko.ObservableArray<RoleModel>;

    @Event()
    public readonly onChange: (securityModel: RoleBasedSecurityModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const availableRoles = await this.roleService.getRoles();
        this.availableRoles(availableRoles);

        if (!this.securityModel) {
            this.securityModel = new RoleBasedSecurityModel();
        }

        const selectedRoles = this.securityModel.roles
            ? availableRoles.filter(x => this.securityModel.roles.includes(x.key))
            : [BuiltInRoles.everyone];

        this.selectedRoles(selectedRoles);
    }

    public selectRole(role: RoleModel): void {
        const roles = [role]; // TODO: Adjust if multiple roles need to be applied.

        this.selectedRoles(roles);
        this.securityModel.roles = roles.map(role => role.key);

        if (this.onChange) {
            this.onChange(this.securityModel);
        }
    }

    public isSelected(role: RoleModel): boolean {
        return this.selectedRoles().some(x => x.key === role.key);
    }
}