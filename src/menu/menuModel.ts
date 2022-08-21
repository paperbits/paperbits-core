import { NavigationItemModel } from "@paperbits/common/navigation";
import { SecurityModel } from "@paperbits/common/security";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * Menu widget model.
 */
export class MenuModel {
    /**
     * Root navigation item.
     */
    public navigationItem?: NavigationItemModel;

    /**
     * Min heading level to display in menu.
     */
    public minHeading?: number;

    /**
     * Max heading level to display in menu.
     */
    public maxHeading?: number;

    /**
     * Menu items.
     */
    public items: NavigationItemModel[];

    /**
     * Menu layout key;
     */
    public layout: string;

    /**
     * Menu local styles.
     */
    public styles: LocalStyles;

    /**
     * Security settings.
     */
     public security?: SecurityModel;

    constructor() {
        this.items = [];
        this.layout = "vertical";
        this.styles = { appearance: "components/menu/default" };
    }
}