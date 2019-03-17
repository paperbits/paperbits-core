import { InlineModel } from "./inlineModel";

export class BlockModel {
    public attrs?: {
        styles?: object;
        className?: string;
        id?: string;
    };

    public content?: InlineModel[];

    constructor(public readonly type: string) { }
}