import { Contract } from "@paperbits/common/contract";

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
     * Key of a permalink used to assign hyperlink.
     */
    targetKey?: string;

    width?: number;

    height?: number;
}