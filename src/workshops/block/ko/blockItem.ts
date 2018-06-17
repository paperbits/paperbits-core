import * as ko from "knockout";
import { BlockContract } from "@paperbits/common/blocks/BlockContract";
import { Contract } from "@paperbits/common/contract";


export class BlockItem {
    public key: string;
    public content: Contract;

    public hasFocus: KnockoutObservable<boolean>;
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;

    constructor(block: BlockContract) {
        this.key = block.key;
        this.content = block.content;
        this.title = ko.observable<string>(block.title);
        this.description = ko.observable<string>(block.description);
        this.hasFocus = ko.observable<boolean>();
    }

    public toBlock(): BlockContract {
        return {
            key: this.key,
            title: this.title(),
            description: this.description(),
            content: this.content
        }
    }
}