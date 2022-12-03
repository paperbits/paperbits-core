import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./gridLayoutSelector.html";
import { Bag } from "@paperbits/common";
import { BlockContract, IBlockService } from "@paperbits/common/blocks";
import { EventManager } from "@paperbits/common/events";
import { Component, Event, OnMounted, Param } from "@paperbits/common/ko/decorators";
import { StyleCompiler, StyleManager } from "@paperbits/common/styles";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { GridViewModelBinder } from ".";
import { GridModelBinder } from "../../grid-layout-section";
import { GridContract } from "../../grid/gridContract";
import { SectionModelBinder } from "../../section";
import { SectionViewModelBinder } from "../../section/ko";
import { BlockItem } from "../../workshops/block/ko";


interface GridLayoutSelectorItem {
    model: any;
    viewModel: any;
    contract: any;
}

@Component({
    selector: "grid-layout-selector",
    template: template
})
export class GridLayoutSelector implements IResourceSelector<any> {
    public readonly snippets: ko.ObservableArray<GridLayoutSelectorItem>;
    public readonly selected: ko.Observable<string>;
    public readonly isBlocksTabEnabled: ko.Observable<boolean>;
    public readonly isBlankTabEnabled: ko.Observable<boolean>;
    public readonly working: ko.Observable<boolean>;

    private gridSnippets: Object;
    private blockSnippets: Object;

    @Param()
    public heading: ko.Observable<string>;

    @Event()
    public onSelect: (rowModel: any) => void;

    constructor(
        private readonly gridModelBinder: GridModelBinder,
        private readonly gridViewModelBinder: GridViewModelBinder,
        private readonly sectionModelBinder: SectionModelBinder,
        private readonly sectionViewModelBinder: SectionViewModelBinder,
        private readonly blockService: IBlockService,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) {
        this.heading = ko.observable();
        this.selectLayout = this.selectLayout.bind(this);
        this.snippets = ko.observableArray();
        this.selected = ko.observable("blank");
        this.working = ko.observable(true);
        this.isBlocksTabEnabled = ko.observable(false);
        this.isBlankTabEnabled = ko.observable(false);
    }

    @OnMounted()
    public async initaialize(): Promise<void> {
        this.working(true);

        const snippets: GridLayoutSelectorItem[] = [];
        this.gridSnippets = await this.blockService.getPredefinedGridSnippets();

        if (this.gridSnippets) {
            for (const presetContract of Objects.clone<any>(this.gridSnippets)) {
                const model = await this.gridModelBinder.contractToModel(presetContract);
                const viewModel = await this.gridViewModelBinder.modelToViewModel(model);

                snippets.push({ model: model, viewModel: viewModel, contract: presetContract });

            }
            this.snippets(snippets);
            this.isBlankTabEnabled(true);
        }

        this.blockSnippets = await this.blockService.getPredefinedBlockSnippets();

        if (this.blockSnippets) {
            this.isBlocksTabEnabled(true);
        }

        this.working(false);
    }

    private async searchLibrary(pattern: string = ""): Promise<BlockItem[]> {
        try {
            const bagOfBlocks: Bag<BlockContract> = this.blockSnippets["blocks"];
            const blocks = Object.values(bagOfBlocks).filter(block => block.title.includes(pattern) && block.type === "blank-section");
            const blockItems = [];

            for (const block of blocks) {
                const content = Objects.getObjectAt<BlockContract>(block.contentKey, this.blockSnippets);
                const styleManager = new StyleManager();

                const bindingContext = {
                    styleManager: styleManager
                };

                const model = await this.sectionModelBinder.contractToModel(content);
                const viewModel = await this.sectionViewModelBinder.modelToViewModel(model, null, bindingContext);

                blockItems.push(new BlockItem(block, content, model, viewModel, styleManager));
            }

            return blockItems;
        }
        catch (error) {
            console.error(`Unable to load snippets from library: ${error}`);
            return [];
        }
    }

    public async selectLayout(item: GridLayoutSelectorItem): Promise<void> {
        const blankSectionSnippets = await this.searchLibrary("");

        if (blankSectionSnippets.length === 0) {
            console.warn("No section scaffold snippets found.");
            return;
        }

        const blankSectionContent = blankSectionSnippets[0].content;
        const blankSectionContentClone: GridContract = blankSectionContent;
        const sectionGridNode = blankSectionContentClone.nodes[0];

        Objects.mergeDeep(sectionGridNode, Objects.clone(item.contract));

        const sectionModel = await this.sectionModelBinder.contractToModel(blankSectionContent);

        if (this.onSelect) {
            this.onSelect(sectionModel);
        }
    }

    public async onBlockSelected(block: BlockItem): Promise<void> {
        if (this.blockService.importSnippet && block.imports) {
            for (const importKey of block.imports) {
                const snippet = Objects.getObjectAt(importKey, this.blockSnippets);

                if (!snippet) {
                    console.warn(`Could not import object by key "${importKey}".`);
                }

                await this.blockService.importSnippet(importKey, snippet);
            }

            // 1. Re-build styles
            const styleManager = new StyleManager(this.eventManager);
            const styleSheet = await this.styleCompiler.getStyleSheet();
            styleManager.setStyleSheet(styleSheet);

            // 2. Re-render popups
            this.eventManager.dispatchEvent("onPopupUpdate");
        }

        if (this.onSelect) {
            this.onSelect(block.model);
        }
    }
}