import * as Utils from "@paperbits/common/utils";
import { TableCellViewModel } from "./tableCellViewModel";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { TableCellModel } from "../tableCellModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { Placeholder } from "../../placeholder/ko/placeholder";
import { TableCellHandlers } from "../tableCellHandlers";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class TableCellViewModelBinder implements ViewModelBinder<TableCellModel, TableCellViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly widgetService: IWidgetService
    ) { }

    // public async modelToViewModel(model: TableCellModel, viewModel?: TableCellViewModel, bindingContext?: Bag<any>): Promise<TableCellViewModel> {
    //     if (!viewModel) {
    //         viewModel = new TableCellViewModel();
    //     }

    //     const promises = model.widgets.map(widgetModel => {
    //         const definition = this.widgetService.getWidgetDefinitionForModel(widgetModel);

    //         if (definition) {
    //             const bindingPromise = this.widgetService.createWidgetBinding(definition, widgetModel, bindingContext);
    //             return bindingPromise;
    //         }

    //         // legacy binding resolution
    //         const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
    //         const bindingPromise = widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
    //         return bindingPromise;
    //     });

    //     const widgetViewModels = await Promise.all(promises);

    //     if (widgetViewModels.length === 0) {
    //         widgetViewModels.push(new Placeholder(model.role));
    //     }

    //     if (model.styles) {
    //         const styleModel = await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager);
    //         viewModel.styles(styleModel);
    //     }

    //     viewModel.role(model.role);
    //     viewModel.widgets(widgetViewModels);

    //     const displayName = model.role.charAt(0).toUpperCase() + model.role.slice(1);

    //     const binding: IWidgetBinding<TableCellModel, TableCellViewModel> = {
    //         name: "table-cell",
    //         displayName: displayName,
    //         layer: bindingContext?.layer,
    //         model: model,
    //         draggable: false,
    //         editor: "table-cell-editor",
    //         handler: TableCellHandlers,
    //         applyChanges: async () => {
    //             await this.modelToViewModel(model, viewModel, bindingContext);
    //             this.eventManager.dispatchEvent(Events.ContentUpdate);
    //         }
    //     };

    //     viewModel["widgetBinding"] = binding;

    //     return viewModel;
    // }

    public stateToInstance(state: any, componentInstance: TableCellViewModel): void {
        componentInstance.styles(state.styles);
        componentInstance.role(state.role);
        componentInstance.widgets(state.widgets)
    }

    public async modelToState(model: TableCellModel, state: any, bindingContext: Bag<any>): Promise<void> {
        const promises = model.widgets.map(widgetModel => {
            const definition = this.widgetService.getWidgetDefinitionForModel(widgetModel);

            if (definition) {
                const bindingPromise = this.widgetService.createWidgetBinding(definition, widgetModel, bindingContext);
                return bindingPromise;
            }

            // legacy binding resolution
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const bindingPromise = widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
            return bindingPromise;
        });

        const widgetViewModels = await Promise.all(promises);

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new Placeholder("Cell"));
        }

        state.role = model.role;
        state.widgets = widgetViewModels;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}