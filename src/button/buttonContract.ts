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
     * @depreacted Keys of user roles.
     */
    roles?: string[];

    /**
     * Security settings.
     */
    security?: SecurityContract;

    /**
     * Assigned hyperlink.
     */
    hyperlink?: HyperlinkContract;

    /**
     * Icon key.
     */
    iconKey: string;
}