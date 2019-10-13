import template from "./blockSelector.html";
import * as ko from "knockout";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { BlockItem } from "./blockItem";
import { BlockContract } from "@paperbits/common/blocks/blockContract";
import { IBlockService } from "@paperbits/common/blocks/IBlockService";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { ViewModelBinderSelector } from "../../../ko/viewModelBinderSelector";

@Component({
    selector: "block-selector",
    template: template,
    injectable: "blockSelector"
})
export class BlockSelector implements IResourceSelector<BlockContract> {
    public readonly searchPattern: ko.Observable<string>;
    public readonly blocks: ko.ObservableArray<BlockItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly widgets: ko.ObservableArray<Object>;

    @Param()
    public readonly selectedBlockItem: ko.Observable<BlockItem>;

    @Param()
    public readonly blockType: string;

    @Event()
    public readonly onSelect: (block: BlockContract) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchBlocks();
    }

    constructor(
        private readonly blockService: IBlockService,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly viewModelBinderSelector: ViewModelBinderSelector) {

        this.blocks = ko.observableArray<BlockItem>();        
        this.widgets = ko.observableArray<Object>();

        this.selectedBlockItem = ko.observable<BlockItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchBlocks);
        
        this.working = ko.observable(true);

        this.selectBlock = this.selectBlock.bind(this);
    }

    public async searchBlocks(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const blocks = await this.blockService.search(this.blockType, searchPattern);
        const blockItems = [];
        for (const block of blocks) {
            const contract = await this.blockService.getBlockContent(block.key);
            const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
            const model = await modelBinder.contractToModel(contract);
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(model);
            const widget = await widgetViewModelBinder.modelToViewModel(model);

            blockItems.push(new BlockItem(block, widget));
        }

        this.blocks(blockItems);
        this.working(false);
    }

    public async selectBlock(block: BlockItem): Promise<void> {
        this.selectedBlockItem(block);

        if (this.onSelect) {
            this.onSelect(block.toBlock());
        }
    }
}