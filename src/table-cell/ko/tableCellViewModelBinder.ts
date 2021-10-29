import * as Utils from "@paperbits/common/utils";
import { TableCellViewModel } from "./tableCellViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { TableCellModel } from "../tableCellModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { TableCellHandlers } from "../tableCellHandlers";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class TableCellViewModelBinder implements ViewModelBinder<TableCellModel, TableCellViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: TableCellModel, viewModel?: TableCellViewModel, bindingContext?: Bag<any>): Promise<TableCellViewModel> {
        if (!viewModel) {
            viewModel = new TableCellViewModel();
        }

        const widgetViewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

            if (widgetViewModelBinder.createWidgetBinding) {
                const binding = await widgetViewModelBinder.createWidgetBinding<TableCellViewModel>(widgetModel, bindingContext);
                widgetViewModels.push(binding);
            }
            else {
                const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
                widgetViewModels.push(widgetViewModel);
            }
        }

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel(model.role));
        }

        if (model.styles) {
            const styleModel = await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager);
            viewModel.styles(styleModel);
        }

        viewModel.role(model.role);
        viewModel.widgets(widgetViewModels);

        const displayName = model.role.charAt(0).toUpperCase() + model.role.slice(1);

        const binding: IWidgetBinding<TableCellModel, TableCellViewModel> = {
            name: "table-cell",
            displayName: displayName,
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: false,
            editor: "table-cell-editor",
            handler: TableCellHandlers,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: TableCellModel): boolean {
        return model instanceof TableCellModel;
    }
}