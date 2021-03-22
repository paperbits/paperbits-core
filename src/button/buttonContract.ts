import { Contract } from "@paperbits/common";
import { HyperlinkContract } from "@paperbits/common/editing";
import { LocalStyles } from "@paperbits/common/styles";


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
    styles?: LocalStyles;

    /**
     * Keys of user roles.
     */
    roles?: string[];
    
    /**
     * Assigned hyperlink.
     */
    hyperlink?: HyperlinkContract;

    /**
     * Icon key.
     */
    iconKey: string;
}