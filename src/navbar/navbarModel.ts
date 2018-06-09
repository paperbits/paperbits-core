import { NavigationItemModel } from "@paperbits/common/navigation/navigationItemModel";


export class NavbarModel {
    public rootKey: string; // Should it move to NavbarItemModel?
    public root: NavigationItemModel;
    public isActive: boolean;
    public pictureSourceKey: string;
    public pictureSourceUrl: string;
}