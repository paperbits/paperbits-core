import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Objects from "@paperbits/common/objects";
import * as Constants from "@paperbits/common/constants";
import { GridModel } from "../../grid-layout-section/gridModel";
import template from "./gridLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { Component, Event, OnMounted, Param } from "@paperbits/common/ko/decorators";
import { GridModelBinder } from "../../grid-layout-section";
import { SectionModelBinder } from "../../section";
import { GridViewModelBinder } from ".";
import { BlockService } from "@paperbits/common/blocks";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { UpdateBlock } from "../../workshops/block/ko/blockSelector";
import { HttpClient } from "@paperbits/common/http";
import { GridContract } from "../../grid/gridContract";


interface GridLayoutSelectorItem {
    viewModel: any;
    contract: any;
}

@Component({
    selector: "grid-layout-selector",
    template: template
})
export class GridLayoutSelector implements IResourceSelector<any> {
    public readonly snippets: ko.ObservableArray<GridModel>;
    public readonly selected: ko.Observable<string>;
    public readonly isBlocksEnabled: ko.Observable<boolean>;
    public readonly working: ko.Observable<boolean>;

    @Param()
    public heading: ko.Observable<string>;

    @Event()
    public onSelect: (rowModel: any) => void;

    constructor(
        private readonly gridModelBinder: GridModelBinder,
        private readonly gridViewModelBinder: GridViewModelBinder,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly sectionModelBinder: SectionModelBinder,
        private readonly blockService: BlockService,
        private readonly httpClient: HttpClient
    ) {
        this.heading = ko.observable();
        this.selectLayout = this.selectLayout.bind(this);
        this.snippets = ko.observableArray();
        this.selected = ko.observable();
        this.working = ko.observable(true);
        this.isBlocksEnabled = ko.observable();
    }

    @OnMounted()
    public async initaialize(): Promise<void> {
        this.working(true);
        const snippets = [];

        const response = await this.httpClient.send({ method: "GET", url: Constants.gridSnippetsLibraryUrl });
        const presets = response.toObject();

        for (const presetContract of Utils.clone<any>(presets)) {
            const model = await this.gridModelBinder.contractToModel(presetContract);
            const viewModel = await this.gridViewModelBinder.modelToViewModel(model);

            snippets.push({ viewModel: viewModel, contract: presetContract });
        }
        this.snippets(snippets);

        const blocksUrl = Constants.blockSnippetsLibraryUrl;
        this.isBlocksEnabled(blocksUrl ? true : false);

        this.working(false);
    }

    public async selectLayout(item: GridLayoutSelectorItem): Promise<void> {
        const blankSections = await this.blockService.search("blank-section", "");
        const blankSectionContent = await this.blockService.getBlockContent(blankSections[0].key);
        const blankSectionContentClone: GridContract = blankSectionContent;
        const sectionGridNode = blankSectionContentClone.nodes[0];

        Objects.mergeDeep(sectionGridNode, Utils.clone(item.contract));

        const sectionModel = await this.sectionModelBinder.contractToModel(blankSectionContent);

        if (this.onSelect) {
            this.onSelect(sectionModel);
        }
    }

    public async onBlockSelected(updateBlock: UpdateBlock): Promise<void> {
        const contract = await this.blockService.getBlockContent(updateBlock.block.key);
        const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
        const model = await modelBinder.contractToModel(contract);

        if (this.onSelect) {
            this.onSelect(model);
        }
    }
}