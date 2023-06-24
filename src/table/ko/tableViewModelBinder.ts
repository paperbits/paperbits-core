import { TableViewModel } from "./tableViewModel";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { TableModel } from "../tableModel";
import { Placeholder } from "../../placeholder/ko/placeholder";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";


export class TableViewModelBinder implements ViewModelBinder<TableModel, TableViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly widgetService: IWidgetService,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public stateToInstance(state: any, componentInstance: TableViewModel): void {
        componentInstance.styles(state.styles);
        componentInstance.widgets(state.widgets)
    }

    public async modelToState(model: TableModel, state: any, bindingContext: Bag<any>): Promise<void> {
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
            widgetViewModels.push(new Placeholder("Table"));
        }

        state.widgets = widgetViewModels;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}