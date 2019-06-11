import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import { GridModel } from "../../grid-layout-section/gridModel";
import template from "./gridLayoutSelector.html";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { GridModelBinder } from "../../grid-layout-section";
import { presets } from "./gridPresets";
import { SectionModel } from "../../section";
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
        private readonly gridViewModelBinder: GridViewModelBinder
    ) {
        this.selectLayout = this.selectLayout.bind(this);
        this.snippets = ko.observableArray();
    }

    @OnMounted()
    public async initaialize(): Promise<void> {
        const snippets = [];

        for (const preset of <any>Utils.clone(presets)) {
            const model = await this.gridModelBinder.contractToModel(<any>preset);
            const viewModel = await this.gridViewModelBinder.modelToViewModel(model);

            snippets.push(viewModel);
        }
        this.snippets(snippets);
    }

    public selectLayout(viewModel: any): void {
        const sectionModel = new SectionModel();
        sectionModel.widgets = [viewModel["widgetBinding"].model]; // TODO: Refactor!

        const gridModel = sectionModel.widgets[0];
        const styles = gridModel["styles"]["instance"];

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
            x["styles"]["instance"]["padding"] = {
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
}