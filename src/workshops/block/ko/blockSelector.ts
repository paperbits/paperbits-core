import template from "./blockSelector.html";
import * as ko from "knockout";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { BlockItem } from "./blockItem";
import { BlockContract } from "@paperbits/common/blocks/blockContract";
import { IBlockService } from "@paperbits/common/blocks/IBlockService";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "block-selector",
    template: template,
    injectable: "blockSelector"
})
export class BlockSelector implements IResourceSelector<BlockContract> {
    public readonly searchPattern: ko.Observable<string>;
    public readonly blocks: ko.ObservableArray<BlockItem>;
    public readonly working: ko.Observable<boolean>;

    @Param()
    public readonly selectedBlockItem: ko.Observable<BlockItem>;

    @Event()
    public readonly onSelect: (block: BlockContract) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchBlocks();
    }

    constructor(private readonly blockService: IBlockService) {
        this.selectBlock = this.selectBlock.bind(this);
        this.blocks = ko.observableArray<BlockItem>();
        this.selectedBlockItem = ko.observable<BlockItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchBlocks);
        this.working = ko.observable(true);

        // setting up...
        this.blocks = ko.observableArray<BlockItem>();
        this.selectedBlockItem = ko.observable<BlockItem>();
        this.searchPattern = ko.observable<string>();
        this.searchPattern.subscribe(this.searchBlocks);
        this.working = ko.observable(true);
    }

    public async searchBlocks(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const blocks = await this.blockService.search("section", searchPattern);
        const blockItems = blocks.map(block => new BlockItem(block));

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