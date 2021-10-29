import { TableViewModel } from "./tableViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { TableModel } from "../tableModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";


export class TableViewModelBinder implements ViewModelBinder<TableModel, TableViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: TableModel, viewModel?: TableViewModel, bindingContext?: Bag<any>): Promise<TableViewModel> {
        if (!viewModel) {
            viewModel = new TableViewModel();
        }

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            viewModels.push(widgetViewModel);
        }

        if (viewModels.length === 0) {
            viewModels.push(<any>new PlaceholderViewModel("Table"));
        }

        viewModel.widgets(viewModels);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const binding: IWidgetBinding<TableModel, TableViewModel> = {
            name: "table",
            displayName: "Table",
            readonly: false,
            editor: "table-editor",
            model: model,
            flow: ComponentFlow.Block,
            draggable: false,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: TableModel): boolean {
        return model instanceof TableModel;
    }
}