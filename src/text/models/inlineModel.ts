import { MarkModel } from "./markModel";

export class InlineModel {
    public marks?: MarkModel[];
    public text?: string;
    public type = "text"; // TODO: ProseMirror artifact
}
