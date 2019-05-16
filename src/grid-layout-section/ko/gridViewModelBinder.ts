import { GridViewModel } from "./gridViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { GridModel } from "../gridModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { GridHandlers } from "../gridHandlers";
import { IEventManager } from "@paperbits/common/events";


export class GridViewModelBinder implements IViewModelBinder<GridModel, GridViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    public modelToViewModel(model: GridModel, viewModel?: GridViewModel): GridViewModel {
        if (!viewModel) {
            viewModel = new GridViewModel();
        }

        const viewModels = model.widgets
            .map(widgetModel => {
                const viewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
                const viewModel = viewModelBinder.modelToViewModel(widgetModel);

                return viewModel;
            });

        if (viewModels.length === 0) {
            viewModels.push(<any>new PlaceholderViewModel("Grid"));
        }

        viewModel.widgets(viewModels);
        viewModel.container(model.container);
        viewModel.styles(model.styles);

        const binding: IWidgetBinding = {
            name: "gridLayoutGrid",
            displayName: "Grid",
            model: model,
            flow: "block",
            editor: "grid-layout-grid-editor",
            handler: GridHandlers,
            applyChanges: (changes) => {
                Object.assign(model, changes);
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: GridModel): boolean {
        return model instanceof GridModel;
    }
}