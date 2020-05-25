import { ListItemContract } from "./listItemContract";
import { BlockContract } from "./blockContract";

/**
 * List element.
 */
export interface ListContract extends BlockContract {
    /**
     * Collection of list items.
     */
    nodes: ListItemContract[];

    /**
     * List local styles.
     */
    styles?: any;
}
