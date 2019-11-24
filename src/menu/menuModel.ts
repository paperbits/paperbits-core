import { NavigationItemModel } from "@paperbits/common/navigation";
import { LocalStyles } from "@paperbits/common/styles";


export class MenuModel {
    public navigationItem?: NavigationItemModel;
    public minHeading?: number;
    public maxHeading?: number;
    public items: NavigationItemModel[];
    public layout: string;
    public roles?: string[];
    public styles: LocalStyles;

    constructor() {
        this.items = [];
        this.roles = null;
        this.layout = "vertical";
    }
}