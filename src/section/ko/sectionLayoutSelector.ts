import template from "./sectionLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { BlockContract } from "@paperbits/common/blocks/BlockContract";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { Component } from "../../ko/component";
import { SectionModel } from "../sectionModel";
import { SliderModel } from "../../slider/sliderModel";

@Component({
    selector: "section-layout-selector",
    template: template,
    injectable: "sectionLayoutSelector"
})
export class SectionLayoutSelector implements IResourceSelector<SectionModel> {
    constructor(
        private readonly modelBinderSelector: ModelBinderSelector,
        public readonly onResourceSelected: (sectionModel: SectionModel) => void
    ) {
        this.selectSectionLayout = this.selectSectionLayout.bind(this);
        this.onBlockSelected = this.onBlockSelected.bind(this);
    }

    public selectSectionLayout(layout: string): void {
        let sectionModel;

        if (layout === "slider") { // This will go away when blocks are implemented
            sectionModel = new SliderModel();
        }
        else {
            sectionModel = new SectionModel();
            sectionModel.layout = layout;
        }

        if (this.onResourceSelected) {
            this.onResourceSelected(sectionModel);
        }
    }

    public async onBlockSelected(block: BlockContract): Promise<void> {
        const modelBinder = this.modelBinderSelector.getModelBinderByNodeType(block.content.type);
        const model = await modelBinder.contractToModel(block.content);

        if (this.onResourceSelected) {
            this.onResourceSelected(model);
        }
    }
}