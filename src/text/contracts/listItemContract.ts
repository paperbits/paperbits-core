import { BlockContract } from "./blockContract";

/**
 * List item.
 */
export interface ListItemContract extends BlockContract {
    /**
     * Child nodes.
     */
    content: BlockContract[];
}
