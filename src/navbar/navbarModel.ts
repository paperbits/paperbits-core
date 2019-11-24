import { NavigationItemModel } from "@paperbits/common/navigation";
import { LocalStyles } from "@paperbits/common/styles";

export class NavbarModel {
    public rootKey: string; // Should it move to NavbarItemModel?
    public root: NavigationItemModel;
    public isActive: boolean;
    public pictureSourceKey: string;
    public pictureSourceUrl: string;
    public pictureWidth: string | number;
    public pictureHeight: string | number;
    public styles: LocalStyles;
}