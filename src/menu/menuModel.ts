import { NavigationItemModel } from "@paperbits/common/navigation";
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
     * Keys of user roles.
     */
    public roles?: string[];

    /**
     * Menu local styles.
     */
    public styles: LocalStyles;

    constructor() {
        this.items = [];
        this.roles = null;
        this.layout = "vertical";
        this.styles = { appearance: "components/menu/default" };
    }
}