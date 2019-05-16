import * as ko from "knockout";
import { GridModel } from "../../grid-layout-section/gridModel";
import template from "./gridLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { GridModelBinder } from "../../grid-layout-section";
import { presets } from "./gridPresets";
import { SectionModel } from "../../section";

@Component({
    selector: "grid-layout-selector",
    template: template,
    injectable: "gridLayoutSelector"
})
export class GridLayoutSelector implements IResourceSelector<any> {
    public readonly snippets: ko.ObservableArray<GridModel>;

    @Event()
    public onSelect: (rowModel: any) => void;

    constructor(private readonly gridModelBinder: GridModelBinder) {
        this.selectLayout = this.selectLayout.bind(this);
        this.snippets = ko.observableArray();
    }

    @OnMounted()
    public async initaialize(): Promise<void> {
        const snippets = [];

        for (const preset of presets) {
            const model = await this.gridModelBinder.contractToModel(<any>preset);
            snippets.push(model);
        }
        this.snippets(snippets);
    }

    public selectLayout(model: GridModel): void {

        const sectionModel = new SectionModel();

        sectionModel.widgets = [model];

        // const rowModel = new RowModel();

        // columnSizeCfgs.forEach(span => {
        //     const column = new ColumnModel();
        //     column.span.md = span.md;
        //     column.span.sm = span.sm;
        //     column.span.md = span.md;
        //     column.span.lg = span.lg;
        //     column.span.xl = span.xl;
        //     rowModel.widgets.push(column);
        // });

        if (this.onSelect) {
            this.onSelect(sectionModel);
        }
    }
}