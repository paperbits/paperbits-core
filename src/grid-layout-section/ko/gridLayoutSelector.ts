import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Constants from "@paperbits/common/constants";
import { GridModel } from "../../grid-layout-section/gridModel";
import template from "./gridLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { GridModelBinder } from "../../grid-layout-section";
import { presets } from "./gridPresets";
import { SectionModel } from "../../section";
import { GridViewModelBinder } from ".";
import { BlockService } from "@paperbits/common/blocks";
import { ModelBinderSelector } from "@paperbits/common/widgets/modelBinderSelector";
import { UpdateBlock } from "../../workshops/block/ko/blockSelector";

@Component({
    selector: "grid-layout-selector",
    template: template
})
export class GridLayoutSelector implements IResourceSelector<any> {
    public readonly snippets: ko.ObservableArray<GridModel>;
    public readonly selected: ko.Observable<string>;
    public isBlocksEnabled: ko.Observable<boolean>;

    @Event()
    public onSelect: (rowModel: any) => void;

    constructor(
        private readonly gridModelBinder: GridModelBinder,
        private readonly gridViewModelBinder: GridViewModelBinder,
        private readonly modelBinderSelector: ModelBinderSelector,
        private readonly blockService: BlockService
    ) {
        this.selectLayout = this.selectLayout.bind(this);
        this.snippets = ko.observableArray();
        this.selected = ko.observable();
        this.isBlocksEnabled = ko.observable();
    }

    @OnMounted()
    public async initaialize(): Promise<void> {
        const snippets = [];

        for (const preset of Utils.clone<any>(presets)) {
            const model = await this.gridModelBinder.contractToModel(preset);
            const viewModel = await this.gridViewModelBinder.modelToViewModel(model);

            snippets.push(viewModel);
        }
        this.snippets(snippets);

        const blocksUrl = Constants.blockSnippetsLibraryUrl;
        this.isBlocksEnabled(blocksUrl ? true : false);
    }

    public selectLayout(viewModel: any): void {
        const sectionModel = new SectionModel();
        sectionModel.widgets = [viewModel["widgetBinding"].model]; // TODO: Refactor!

        const gridModel = sectionModel.widgets[0];
        const styles = gridModel.styles.instance;

        styles["size"] = {
            sm: {
                maxWidth: 540
            },
            md: {
                maxWidth: 720
            },
            lg: {
                maxWidth: 960
            },
            xl: {
                maxWidth: 1140
            }
        };

        styles["margin"] = {
            xs: {
                top: 10,
                left: "auto",
                right: "auto",
                bottom: 10
            },
            md: {
                top: 15,
                bottom: 15
            },
            xl: {
                top: 25,
                bottom: 25
            }
        };

        gridModel.widgets.forEach(x => {
            x.styles.instance["padding"] = {
                xs: {
                    top: 5,
                    left: 5,
                    right: 5,
                    bottom: 5
                },
                md: {
                    top: 15,
                    left: 15,
                    right: 15,
                    bottom: 15
                }
            };
        });

        if (this.onSelect) {
            this.onSelect(sectionModel);
        }
    }

    public async onBlockSelected(updateBlock: UpdateBlock): Promise<void> {
        const contract = await this.blockService.getBlockContent(updateBlock.block.key, updateBlock.blockType);
        const modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
        const model = await modelBinder.contractToModel(contract);

        if (this.onSelect) {
            this.onSelect(model);
        }
    }
}