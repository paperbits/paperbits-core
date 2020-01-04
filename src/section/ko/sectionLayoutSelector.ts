import template from "./sectionLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { BlockContract } from "@paperbits/common/blocks/blockContract";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { Component, Event } from "@paperbits/common/ko/decorators";
import { SectionModel } from "../sectionModel";
import { BlockService } from "@paperbits/common/blocks";

@Component({
    selector: "section-layout-selector",
    template: template
})
export class SectionLayoutSelector implements IResourceSelector<SectionModel> {
    @Event()
    public onSelect: (sectionModel: SectionModel) => void;

    constructor(
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly blockService: BlockService
    ) {
        this.selectSectionLayout = this.selectSectionLayout.bind(this);
        this.onBlockSelected = this.onBlockSelected.bind(this);
    }

    public selectSectionLayout(): void {
        const sectionModel = new SectionModel();

        if (this.onSelect) {
            this.onSelect(sectionModel);
        }
    }

    public async onBlockSelected(block: BlockContract): Promise<void> {
        const contract = await this.blockService.getBlockContent(block.key);
        const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
        const model = await modelBinder.contractToModel(contract);

        if (this.onSelect) {
            this.onSelect(model);
        }
    }
}