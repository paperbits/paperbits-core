import { UserService, BuiltInRoles } from "@paperbits/common/user";

export class DesignerUserService implements UserService {
    private currentViewRoles: string[];

    constructor() {
        this.currentViewRoles = [BuiltInRoles.anonymous.key];
    }

    public async getUserPhotoUrl(): Promise<string> {
        return "https://cdn.paperbits.io/images/portrait.svg";
    }

    public async getUserRoles(): Promise<string[]> {
        return this.currentViewRoles;
    }

    public async setUserRoles(roles: string[]): Promise<void> {
        this.currentViewRoles = roles;
    }
}