import template from "./blockSelector.html";
import * as ko from "knockout";
import * as Constants from "@paperbits/common/constants";
import * as Objects from "@paperbits/common/objects";
import { BlockItem } from "./blockItem";
import { BlockContract } from "@paperbits/common/blocks/blockContract";
import { IBlockService } from "@paperbits/common/blocks";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { ViewModelBinderSelector } from "../../../ko/viewModelBinderSelector";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { StyleManager } from "@paperbits/common/styles";
import { HttpClient } from "@paperbits/common/http";
import { Bag } from "@paperbits/common";

export interface UpdateBlock { block: BlockContract; blockType: string; }

const blockPath = "blocks";


@Component({
    selector: "block-selector",
    template: template
})
export class BlockSelector {
    public readonly searchPattern: ko.Observable<string>;
    public readonly blocks: ko.ObservableArray<BlockItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly widgets: ko.ObservableArray<Object>;

    constructor(
        private readonly blockService: IBlockService,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly httpClient: HttpClient
    ) {
        this.blocks = ko.observableArray();
        this.widgets = ko.observableArray();
        this.searchPattern = ko.observable();
        this.working = ko.observable();
    }

    @Param()
    public readonly blockType: string;

    @Param()
    public readonly blockSource: string;

    @Event()
    public readonly onSelect: (blockItem: BlockItem) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchBlocks();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchBlocks);
    }

    private async searchLibrary(pattern: string): Promise<BlockItem[]> {
        try {
            const blocksUrl = Constants.blockSnippetsLibraryUrl;

            if (!blocksUrl) {
                console.warn("Settings for blocksUrl not found.");
                return [];
            }

            const response = await this.httpClient.send({
                url: blocksUrl,
                method: "GET"
            });

            const blockSnippets = <any>response.toObject();
            const bagOfBlocks: Bag<BlockContract> = blockSnippets[blockPath];
            const blocks = Object.values(bagOfBlocks).filter(block => block.title.includes(pattern) && block.type === this.blockType);
            const blockItems: BlockItem[] = [];

            for (const block of blocks) {
                const content = Objects.getObjectAt<BlockContract>(block.contentKey, blockSnippets);
                const styleManager = new StyleManager();

                const bindingContext = {
                    styleManager: styleManager
                };

                const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(content);
                const model = await modelBinder.contractToModel(content);
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(model);
                const viewModel = await widgetViewModelBinder.modelToViewModel(model, null, bindingContext);

                blockItems.push(new BlockItem(block, content, model, viewModel, styleManager));
            }

            return blockItems;
        }
        catch (error) {
            console.error(`Unable to load snippets from library: ${error}`);
            return [];
        }
    }

    private async searchSaved(pattern: string): Promise<BlockItem[]> {
        try {
            const blockItems: BlockItem[] = [];
            const blocks = await this.blockService.search(this.blockType, pattern);

            for (const block of blocks) {
                const content = await this.blockService.getBlockContent(block.key);

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
                const viewModel = await widgetViewModelBinder.modelToViewModel(model, null, bindingContext);

                blockItems.push(new BlockItem(block, content, model, viewModel, styleManager));
            }

            return blockItems;
        }
        catch (error) {
            console.error(`Unable to load saved snippets: ${error}`);
            return [];
        }
    }

    public async searchBlocks(searchPattern: string = ""): Promise<void> {
        this.working(true);

        let blockItems: BlockItem[] = [];

        switch (this.blockSource) {
            case "library":
                blockItems = await this.searchLibrary(searchPattern);
                break;

            case "saved":
                blockItems = await this.searchSaved(searchPattern);
                break;

            default:
                throw new Error(`Unknown block source: ${this.blockSource}.`);
        }

        this.blocks(blockItems);
        this.working(false);
    }

    public selectBlock(block: BlockItem): void {
        if (this.onSelect) {
            this.onSelect(block);
        }
    }

    public async deleteBlock(block: BlockItem): Promise<void> {
        await this.blockService.deleteBlock(block.toContract());
        await this.searchBlocks(this.searchPattern());
    }
}