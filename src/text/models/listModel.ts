import { BlockModel } from "./blockModel";
import { ListItemModel } from "./listItemModel";

export class ListModel extends BlockModel {
    public attrs?: {
        order?: number;
        styles?: object;
        className?: string;
    };

    public content: ListItemModel[];

    constructor(type: string) { 
        super(type);
    }
}
