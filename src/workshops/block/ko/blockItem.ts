import * as ko from "knockout";
import { BlockContract } from "@paperbits/common/blocks";


export class BlockItem {
    public key: string;
    public contentKey: string;

    public hasFocus: ko.Observable<boolean>;
    public title: ko.Observable<string>;
    public description: ko.Observable<string>;

    constructor(block: BlockContract) {
        this.key = block.key;
        this.contentKey = block.contentKey;
        this.title = ko.observable<string>(block.title);
        this.description = ko.observable<string>(block.description);
        this.hasFocus = ko.observable<boolean>();
    }

    public toBlock(): BlockContract {
        return {
            key: this.key,
            type: "block",
            title: this.title(),
            description: this.description(),
            contentKey: this.contentKey
        };
    }
}