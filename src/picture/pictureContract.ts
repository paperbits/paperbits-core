import { Contract } from "@paperbits/common/contract";
import { HyperlinkContract } from "@paperbits/common/editing";
import { LocalStyles } from "@paperbits/common/styles";

/**
 * Picture widget contract.
 */
export interface PictureContract extends Contract {
    /**
     * Key of a permalink referencing the source of the picture.
     */
    sourceKey?: string;

    /**
     * Caption on the picture, used also as alternative text.
     */
    caption?: string;

    /**
     * Hyperlink attached to the picture.
     */
    hyperlink?: HyperlinkContract;

    /**
     * Picture width.
     */
    width?: number;

    /**
     * Picture height.
     */
    height?: number;

    /**
     * Picture styles.
     */
    styles?: LocalStyles;
}