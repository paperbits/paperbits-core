import { Contract } from "@paperbits/common";
import { InlineContract } from "./inlineContract";

/**
 * Block element, e.g. paragraph, heading, etc.
 */
export interface BlockContract extends Contract {
    /**
     * Data associated with an instance of the block element.
     */
    attrs?: {
        [key: string]: any;
    };

    /**
     * Child nodes.
     */
    nodes?: InlineContract[];
}
