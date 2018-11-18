import template from "./addBlockDialog.html";
import * as ko from "knockout";
import { IBlockService } from "@paperbits/common/blocks/IBlockService";
import { Component } from "@paperbits/common/ko/decorators";
import { SectionModelBinder } from "../../../section/sectionModelBinder";
import { SectionModel } from "../../../section/sectionModel";

@Component({
    selector: "add-block-dialog",
    template: template,
    injectable: "addBlockDialog"
})
export class AddBlockDialog {
    public readonly working: KnockoutObservable<boolean>;
    public readonly name: KnockoutObservable<string>;

    constructor(
        private readonly blockService: IBlockService,
        private readonly sectionModelBinder: SectionModelBinder,
        private readonly sectionModel: SectionModel
    ) {
        this.addBlock = this.addBlock.bind(this);

        this.working = ko.observable(false);
        this.name = ko.observable<string>();
        this.name.extend({ required: true });
    }

    public async addBlock(): Promise<void> {
        const content = this.sectionModelBinder.modelToContract(this.sectionModel);

        await this.blockService.createBlock(this.name(), "", content);
    }
}