import { Bag } from "@paperbits/common";
import { NavigationItemModel } from "@paperbits/common/navigation";


export class MenuModel {
    public title?: string;
    public navigationItemKey?: string;
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