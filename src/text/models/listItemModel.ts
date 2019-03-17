import { BlockModel } from "./blockModel";

export class ListItemModel extends BlockModel {
    public content: BlockModel[];
    public type = "list-item"; // TODO: ProseMirror artifact
}
