import { Contract } from "@paperbits/common";

/**
 * Tab panel contract.
 */
export interface TabPanelContract extends Contract {
    /**
     * Local styles.
     */
    styles?: any;

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
    styles?: any;
}