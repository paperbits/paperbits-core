import { NavigationItemModel } from "@paperbits/common/navigation";

export class TableOfContentsModel {
    public title?: string;
    public navigationItemKey?: string;
    public minHeading?: number;
    public maxHeading?: number;
    public items: NavigationItemModel[];
}