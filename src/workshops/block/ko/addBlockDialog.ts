import template from "./addBlockDialog.html";
import * as ko from "knockout";
import { IBlockService, BlockType } from "@paperbits/common/blocks";
import { Component, Param, Event } from "@paperbits/common/ko/decorators";
import { ViewManager } from "@paperbits/common/ui";

@Component({
    selector: "add-block-dialog",
    template: template
})
export class AddBlockDialog {
    public readonly working: ko.Observable<boolean>;
    public readonly name: ko.Observable<string>;
    public readonly description: ko.Observable<string>;

    @Param()
    public readonly blockContract: any;
    
    @Param()
    public readonly blockType: BlockType;

    @Event()
    public readonly onClose: () => void;

    constructor(
        private readonly blockService: IBlockService,
        private readonly viewManager: ViewManager
    ) {
        this.working = ko.observable(false);
        this.name = ko.observable<string>();
        this.name.extend(<any>{ required: true });
        this.description = ko.observable<string>();
    }

    public async addBlock(): Promise<void> {
        if (!this.name()) {
            return;
        }

        await this.blockService.createBlock(this.name(), this.description() || "", this.blockContract, this.blockType);
        this.viewManager.notifySuccess("Blocks", "Block added to library.");

        if (this.onClose){
            this.onClose();
        }
    }
}