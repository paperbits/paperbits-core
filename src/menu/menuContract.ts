import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * Menu widget contract.
 */
export interface MenuContract extends Contract {
    /**
     * Root navigation item key.
     */
    navigationItemKey?: string;

    /**
     * Min heading level to display in menu.
     */
    minHeading?: number;

    /**
     * Max heading level to display in menu.
     */
    maxHeading?: number;

    /**
     * Menu layout key;
     */
    layout?: string;

    /**
     * Keys of user roles.
     */
    roles?: string[];

    /**
     * Menu local styles.
     */
    styles: LocalStyles;
}