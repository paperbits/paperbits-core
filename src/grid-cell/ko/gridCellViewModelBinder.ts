import * as Utils from "@paperbits/common/utils";
import { GridCellViewModel } from "./gridCellViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { GridCellModel } from "../gridCellModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { GridCellHandlers } from "../gridCellHandlers";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";

export class GridCellViewModelBinder implements ViewModelBinder<GridCellModel, GridCellViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: GridCellModel, viewModel?: GridCellViewModel, bindingContext?: Bag<any>): Promise<GridCellViewModel> {
        if (!viewModel) {
            viewModel = new GridCellViewModel();
        }

        const widgetViewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

            if (widgetViewModelBinder.createWidgetBinding) {
                const binding = await widgetViewModelBinder.createWidgetBinding(widgetModel, bindingContext);
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

        const binding: IWidgetBinding<GridCellModel> = {
            name: "grid-cell",
            displayName: displayName,
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: false,
            editor: "grid-cell-editor",
            handler: GridCellHandlers,
            applyChanges: async (changes) => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: GridCellModel): boolean {
        return model instanceof GridCellModel;
    }
}