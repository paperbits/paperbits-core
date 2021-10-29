import { Bag } from "@paperbits/common";
import { IWidgetBinding } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { GridCellHandlers } from "../gridCellHandlers";
import { GridCellModel } from "../gridCellModel";
import { GridCellViewModel } from "./gridCellViewModel";

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

        const promises = model.widgets.map(widgetModel => {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

            return widgetViewModelBinder.createWidgetBinding
                ? widgetViewModelBinder.createWidgetBinding<GridCellViewModel>(widgetModel, bindingContext)
                : widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
        });

        const widgetViewModels = await Promise.all(promises);

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

        const binding: IWidgetBinding<GridCellModel, GridCellViewModel> = {
            name: "grid-cell",
            displayName: displayName,
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: false,
            editor: "grid-cell-editor",
            handler: GridCellHandlers,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: GridCellModel): boolean {
        return model instanceof GridCellModel;
    }
}