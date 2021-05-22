import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";


/**
 * Popup dismiss button data contract.
 */
export interface DismissButtonContract extends Contract {
    /**
     * Label on the button.
     */
    label: string;

    /**
     * Local styles.
     */
    styles?: LocalStyles;
    
    /**
     * Icon key.
     */
    iconKey: string;
}