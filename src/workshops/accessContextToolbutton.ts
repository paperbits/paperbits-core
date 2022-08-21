import * as ko from "knockout";
import { IComponent, ToolButton, ViewManager } from "@paperbits/common/ui";
import { RoleModel, RoleService } from "@paperbits/common/user";


export class AccessContextToolButton implements ToolButton {
    public readonly selectedRoles: ko.ObservableArray<RoleModel> = ko.observableArray();
    public readonly availableRoles: ko.ObservableArray<RoleModel>= ko.observableArray();
    public iconClass: string = "paperbits-icon paperbits-icon paperbits-single-02";
    public title: string = "Roles";
    public tooltip: string = `<h1>Roles</h1><p>Push your changes to the storage.</p><div class="subtle">(Ctrl+S)</div>`;
    public disabled: ko.Observable<boolean>;

    public component: IComponent = {
        name: 'role-selector',
        params: {
            availableRoles: this.availableRoles,
            selectedRoles: this.selectedRoles,
            onSelect: this.onRoleSelect.bind(this)
        }
    }
   
    constructor(
        private readonly roleService: RoleService,
        private readonly viewManager: ViewManager
    ) {
        this.disabled = ko.observable(false);
        this.initialize();
    }

    private async initialize(): Promise<void> {
        const roles = await this.roleService.getRoles();
        this.availableRoles(roles.slice(1)); // Excluding Everyone.
        this.selectedRoles(this.viewManager.getViewRoles())
    }

    public onRoleSelect(roles: RoleModel[]): void {
        this.selectedRoles(roles);
        this.viewManager.setViewRoles(roles);
    }
}