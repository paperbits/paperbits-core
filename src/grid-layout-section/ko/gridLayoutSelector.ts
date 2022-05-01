import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import * as Constants from "@paperbits/common/constants";
import template from "./gridLayoutSelector.html";
import { Bag } from "@paperbits/common";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { Component, Event, OnMounted, Param } from "@paperbits/common/ko/decorators";
import { GridModelBinder } from "../../grid-layout-section";
import { SectionModelBinder } from "../../section";
import { GridViewModelBinder } from ".";
import { BlockContract, IBlockService } from "@paperbits/common/blocks";
import { HttpClient } from "@paperbits/common/http";
import { GridContract } from "../../grid/gridContract";
import { BlockItem } from "../../workshops/block/ko";
import { StyleCompiler, StyleManager } from "@paperbits/common/styles";
import { SectionViewModelBinder } from "../../section/ko";
import { EventManager } from "@paperbits/common/events";


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
    public readonly isBlocksEnabled: ko.Observable<boolean>;
    public readonly working: ko.Observable<boolean>;

    @Param()
    public heading: ko.Observable<string>;

    @Event()
    public onSelect: (rowModel: any) => void;

    constructor(
        private readonly gridModelBinder: GridModelBinder,
        private readonly gridViewModelBinder: GridViewModelBinder,
        private readonly sectionModelBinder: SectionModelBinder,
        private readonly sectionViewModelBinder: SectionViewModelBinder,
        private readonly httpClient: HttpClient,
        private readonly blockService: IBlockService,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) {
        this.heading = ko.observable();
        this.selectLayout = this.selectLayout.bind(this);
        this.snippets = ko.observableArray();
        this.selected = ko.observable("blank");
        this.working = ko.observable(true);
        this.isBlocksEnabled = ko.observable();
    }

    @OnMounted()
    public async initaialize(): Promise<void> {
        this.working(true);
        const snippets: GridLayoutSelectorItem[] = [];

        const response = await this.httpClient.send({ method: "GET", url: Constants.gridSnippetsLibraryUrl });
        const presets = response.toObject();

        for (const presetContract of Objects.clone<any>(presets)) {
            const model = await this.gridModelBinder.contractToModel(presetContract);
            const viewModel = await this.gridViewModelBinder.modelToViewModel(model);

            snippets.push({ model: model, viewModel: viewModel, contract: presetContract });

        }
        this.snippets(snippets);

        const blocksUrl = Constants.blockSnippetsLibraryUrl;
        this.isBlocksEnabled(blocksUrl ? true : false);

        this.working(false);
    }

    private async searchLibrary(pattern: string = ""): Promise<BlockItem[]> {
        try {
            const blocksUrl = Constants.blockSnippetsLibraryUrl;

            if (!blocksUrl) {
                console.warn("Settings for blocksUrl not found.");
                return [];
            }

            const response = await this.httpClient.send({ url: blocksUrl, method: "GET" });
            const blockSnippets = <any>response.toObject();
            const bagOfBlocks: Bag<BlockContract> = blockSnippets["blocks"];
            const blocks = Object.values(bagOfBlocks).filter(block => block.title.includes(pattern) && block.type === "blank-section");
            const blockItems = [];

            for (const block of blocks) {
                const content = Objects.getObjectAt<BlockContract>(block.contentKey, blockSnippets);
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
            const response = await this.httpClient.send({ url: Constants.blockSnippetsLibraryUrl, method: "GET" });
            const library = <any>response.toObject();

            for (const importKey of block.imports) {
                const snippet = Objects.getObjectAt(importKey, library);

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