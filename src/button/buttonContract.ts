import { Contract } from "@paperbits/common";
import { HyperlinkContract } from "@paperbits/common/editing";


/**
 * Button data contract.
 */
export interface ButtonContract extends Contract {
    /**
     * Label on the button.
     */
    label: string;

    /**
     * Button local styles.
     */
    styles?: any;

    /**
     * Assigned hyperlink.
     */
    hyperlink?: HyperlinkContract;
}