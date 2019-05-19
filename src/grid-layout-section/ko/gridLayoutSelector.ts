import * as ko from "knockout";
import { GridModel } from "../../grid-layout-section/gridModel";
import template from "./gridLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { GridModelBinder } from "../../grid-layout-section";
import { presets } from "./gridPresets";
import { SectionModel } from "../../section";
import { IStyleCompiler } from "@paperbits/common/styles";
import { GridViewModelBinder } from ".";

@Component({
    selector: "grid-layout-selector",
    template: template,
    injectable: "gridLayoutSelector"
})
export class GridLayoutSelector implements IResourceSelector<any> {
    public readonly snippets: ko.ObservableArray<GridModel>;

    @Event()
    public onSelect: (rowModel: any) => void;

    constructor(
        private readonly gridModelBinder: GridModelBinder,
        private readonly gridViewModelBinder: GridViewModelBinder,
        private readonly styleCompiler: IStyleCompiler
    ) {
        this.selectLayout = this.selectLayout.bind(this);
        this.snippets = ko.observableArray();
    }

    @OnMounted()
    public async initaialize(): Promise<void> {
        const snippets = [];

        for (const preset of presets) {
            const model = await this.gridModelBinder.contractToModel(<any>preset);
            const viewModel = await this.gridViewModelBinder.modelToViewModel(model);

            snippets.push(viewModel);
        }
        this.snippets(snippets);
    }

    public selectLayout(viewModel: any): void {
        const sectionModel = new SectionModel();
        sectionModel.widgets = [viewModel["widgetBinding"].model]; // TODO: Refactor!

        if (this.onSelect) {
            this.onSelect(sectionModel);
        }
    }
}