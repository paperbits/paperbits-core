import { Contract } from "@paperbits/common";
import { MarkContract } from "./markContract";

/**
 * Inline element.
 */
export interface InlineContract extends Contract {
    /**
     * Collection of marks assigned to the piece of text.
     */
    marks?: MarkContract[];

    /**
     * Piece of text.
     */
    text?: string;
}
