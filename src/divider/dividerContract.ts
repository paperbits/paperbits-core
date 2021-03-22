import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * Divider data contract.
 */
export interface DividerContract extends Contract {
    /**
     * Divider local styles.
     */
    styles?: LocalStyles;
}