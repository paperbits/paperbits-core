import template from "./blockSelector.html";
import * as ko from "knockout";
import { IResourceSelector } from "@paperbits/common/ui";
import { BlockItem } from "./blockItem";
import { BlockContract } from "@paperbits/common/blocks/blockContract";
import { IBlockService } from "@paperbits/common/blocks";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { ViewModelBinderSelector } from "../../../ko/viewModelBinderSelector";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "block-selector",
    template: template
})
export class BlockSelector implements IResourceSelector<BlockContract> {
    public readonly searchPattern: ko.Observable<string>;
    public readonly blocks: ko.ObservableArray<BlockItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly widgets: ko.ObservableArray<Object>;

    constructor(
        private readonly blockService: IBlockService,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly viewModelBinderSelector: ViewModelBinderSelector
    ) {
        this.blocks = ko.observableArray();
        this.widgets = ko.observableArray();
        this.selectedBlockItem = ko.observable();
        this.searchPattern = ko.observable();
        this.working = ko.observable();
    }

    @Param()
    public readonly selectedBlockItem: ko.Observable<BlockItem>;

    @Param()
    public readonly blockType: string;

    @Event()
    public readonly onSelect: (block: BlockContract) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchBlocks();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchBlocks);
    }

    public async searchBlocks(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const blocks = await this.blockService.search(this.blockType, searchPattern);
        const blockItems = [];

        for (const block of blocks) {
            const content = await this.blockService.getBlockContent(block.key);
            const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(content);
            const model = await modelBinder.contractToModel(content);
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