import { Bag } from "@paperbits/common";
import { NavigationItemModel } from "@paperbits/common/navigation";


export class MenuModel {
    public navigationItem?: NavigationItemModel;
    public minHeading?: number;
    public maxHeading?: number;
    public items: NavigationItemModel[];
    public layout: string;
    public roles?: string[];
    public styles: Bag<string>;

    constructor() {
        this.items = [];
        this.roles = null;
        this.layout = "vertical";
    }
}