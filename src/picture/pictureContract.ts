import { Contract } from "@paperbits/common/contract";
import { HyperlinkContract } from "@paperbits/common/editing";

export interface PictureContract extends Contract {
    /**
     * Key of a permalink referencing source of the picture.
     */
    sourceKey?: string;

    /**
     * Caption on the picture used as alternative text.
     */
    caption?: string;

    /**
     * Specfies one of pre-defined picture layouts, e.g. "polaroid", "noframe", "circle".
     */
    layout?: string;

    /**
     * Specifies animation applied to the picture. e.g. "shake", "fade-in".
     */
    animation?: string;

    /**
     * Hyperlink attached to the picture.
     */
    hyperlink?: HyperlinkContract

    /**
     * Picture width.
     */
    width?: number;

    /**
     * Picture height.
     */
    height?: number;
}