import template from "./addBlockDialog.html";
import * as ko from "knockout";
import { IBlockService } from "@paperbits/common/blocks";
import { Component, Param, Event } from "@paperbits/common/ko/decorators";
import { IViewManager } from "@paperbits/common/ui";
import { SectionModelBinder } from "../../../section/sectionModelBinder";
import { SectionModel } from "../../../section/sectionModel";

@Component({
    selector: "add-block-dialog",
    template: template,
    injectable: "addBlockDialog"
})
export class AddBlockDialog {
    public readonly working: ko.Observable<boolean>;
    public readonly name: ko.Observable<string>;
    public readonly description: ko.Observable<string>;

    @Param()
    public readonly sectionModel: SectionModel;

    @Event()
    public readonly onClose: () => void;

    constructor(
        private readonly blockService: IBlockService,
        private readonly sectionModelBinder: SectionModelBinder,
        private readonly viewManager: IViewManager
    ) {
        this.addBlock = this.addBlock.bind(this);

        this.working = ko.observable(false);
        this.name = ko.observable<string>();
        this.name.extend(<any>{ required: true });
        this.description = ko.observable<string>();
    }

    public async addBlock(): Promise<void> {
        if (!this.name()) {
            return;
        }
        const content = this.sectionModelBinder.modelToContract(this.sectionModel);

        await this.blockService.createBlock(this.name(), this.description(), content, "section");
        this.viewManager.notifySuccess("Blocks", "Block added to library.");

        this.onClose();
    }
}