import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * Text block data contract.
 */
 export interface TextBlockContract extends Contract {
    /**
     * Text block local styles.
     */
    styles?: LocalStyles;

    /**
     * Keys of user roles.
     */
    roles?: string[];
}