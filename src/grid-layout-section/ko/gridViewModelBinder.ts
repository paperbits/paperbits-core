import { GridViewModel } from "./gridViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { GridModel } from "../gridModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { WidgetViewModel } from "../../ko";


export class GridViewModelBinder implements ViewModelBinder<GridModel, GridViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: GridModel, viewModel?: GridViewModel, bindingContext?: Bag<any>): Promise<GridViewModel> {
        if (!viewModel) {
            viewModel = new GridViewModel();
        }

        const promises = model.widgets.map(widgetModel => {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            return widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
        });

        const viewModels = await Promise.all<WidgetViewModel>(promises);

        if (viewModels.length === 0) {
            viewModels.push(<any>new PlaceholderViewModel("Grid"));
        }

        viewModel.widgets(viewModels);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const binding: IWidgetBinding<GridModel, GridViewModel> = {
            name: "grid",
            displayName: "Grid",
            readonly: true,
            model: model,
            draggable: false,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: GridModel): boolean {
        return model instanceof GridModel;
    }
}