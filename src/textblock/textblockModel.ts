import { BlockModel } from "@paperbits/common/text/models";

export class TextblockModel {
    public state: BlockModel[];

    constructor(state: any) {
        this.state = state;
    }
}