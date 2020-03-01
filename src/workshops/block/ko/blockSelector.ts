import template from "./blockSelector.html";
import * as ko from "knockout";
import { IResourceSelector } from "@paperbits/common/ui";
import { BlockItem } from "./blockItem";
import { BlockContract } from "@paperbits/common/blocks/blockContract";
import { IBlockService, BlockType } from "@paperbits/common/blocks";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { ViewModelBinderSelector } from "../../../ko/viewModelBinderSelector";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { StyleManager } from "@paperbits/common/styles";

export interface UpdateBlock { block: BlockContract; blockType: BlockType; }
@Component({
    selector: "block-selector",
    template: template
})
export class BlockSelector implements IResourceSelector<UpdateBlock> {
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
        this.searchPattern = ko.observable();
        this.working = ko.observable();
    }

    @Param()
    public readonly blockType: BlockType;

    @Event()
    public readonly onSelect: (updateBlock: UpdateBlock) => void;

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
            const content = await this.blockService.getBlockContent(block.key, this.blockType);

            if (!content.type) {
                content.type = block.type;
            }

            const styleManager = new StyleManager();

            const bindingContext = {
                styleManager: styleManager
            };

            const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(content);
            const model = await modelBinder.contractToModel(content);
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(model);
            const widget = await widgetViewModelBinder.modelToViewModel(model, null, bindingContext);

            blockItems.push(new BlockItem(block, widget, styleManager));
        }

        this.blocks(blockItems);
        this.working(false);
    }

    public async selectBlock(block: BlockItem): Promise<void> {
        if (this.onSelect) {
            this.onSelect({block: block.toBlock(), blockType: this.blockType});
        }
    }

    public async deleteBlock(block: BlockItem, event: any): Promise<void> {
        event.stopImmediatePropagation();
        if (block && this.blockType === BlockType.saved) {
            await this.blockService.deleteBlock(block.toBlock());
            await this.searchBlocks(this.searchPattern());
        }
    }
}