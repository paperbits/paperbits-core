import template from "./sectionLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { BlockContract } from "@paperbits/common/blocks/BlockContract";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { Component, Event } from "../../ko/decorators";
import { SectionModel } from "../sectionModel";

@Component({
    selector: "section-layout-selector",
    template: template,
    injectable: "sectionLayoutSelector"
})
export class SectionLayoutSelector implements IResourceSelector<SectionModel> {
    @Event()
    public onSelect: (sectionModel: SectionModel) => void;

    constructor(private readonly modelBinderSelector: ModelBinderSelector) {
        this.selectSectionLayout = this.selectSectionLayout.bind(this);
        this.onBlockSelected = this.onBlockSelected.bind(this);
    }

    public selectSectionLayout(layout: string): void {
        const sectionModel = new SectionModel();
        sectionModel.container = layout;

        if (this.onSelect) {
            this.onSelect(sectionModel);
        }
    }

    public async onBlockSelected(block: BlockContract): Promise<void> {
        const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(block.content.type);
        const model = await modelBinder.contractToModel(block.content);

        if (this.onSelect) {
            this.onSelect(model);
        }
    }
}