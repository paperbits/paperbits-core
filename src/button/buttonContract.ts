import { Contract } from "@paperbits/common";
import { HyperlinkContract } from "@paperbits/common/editing";
import { LocalStyles } from "@paperbits/common/styles";
import { SecurityContract } from "@paperbits/common/security";


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
     * Security settings.
     */
     security?: SecurityContract;

    /**
     * @deprecated Keys of user roles.
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