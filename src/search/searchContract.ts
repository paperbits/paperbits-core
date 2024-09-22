import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

export interface SearchContract extends Contract {
    /**
     * Text input label.
     */
    label: string;

    /**
     * Text input placeholder.
     */
    placeholder: string;

    /**
     * Text input local styles.
     */
    styles?: LocalStyles;
}
