import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * Tab panel contract.
 */
export interface TabPanelContract extends Contract {
    /**
     * Local styles.
     */
    styles?: LocalStyles;

    /**
     * Tab items.
     */
    tabPanelItems: TabPanelItemContract[];
}

/**
 * Tab item contract.
 */
export interface TabPanelItemContract extends Contract {
    /**
     * Label on the tab.
     */
    label: string;

    /**
     * Local styles.
     */
    styles?: LocalStyles;
}