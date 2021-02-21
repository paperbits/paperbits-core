import * as ko from "knockout";
import { BlockContract } from "@paperbits/common/blocks";
import { StyleManager } from "@paperbits/common/styles";


export class BlockItem {
    public key: string;
    public contentKey: string;

    public readonly hasFocus: ko.Observable<boolean>;
    public readonly title: ko.Observable<string>;
    public readonly description: ko.Observable<string>;
    public widget: any;
    public styleManager: StyleManager;

    constructor(block: BlockContract, widget: any, styleManager: StyleManager) {
        this.key = block.key;
        this.contentKey = block.contentKey;
        this.title = ko.observable<string>(block.title);
        this.description = ko.observable<string>(block.description);
        this.hasFocus = ko.observable<boolean>();
        this.widget = widget;
        this.styleManager = styleManager;
    }

    public toContract(): BlockContract {
        return {
            key: this.key,
            type: "block",
            title: this.title(),
            description: this.description(),
            contentKey: this.contentKey
        };
    }
}