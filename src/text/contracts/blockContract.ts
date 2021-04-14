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

    /**
     * Block local styles.
     */
    styles?: any;

    /**
     * Block identifier. Can be used for multiple purposes, e.g. for assigning anchors.
     */
    identifier?: string;

    /**
     * TODO: Quick fix, needs to be refactored.
     */
    name?: string;

    /**
     * TODO: Quick fix, needs to be refactored.
     */
    placeholder?: string;
}
