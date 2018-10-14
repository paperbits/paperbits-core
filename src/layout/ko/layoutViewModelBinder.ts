import { LayoutViewModel } from "./layoutViewModel";
import { LayoutModel } from "../layoutModel";
import { LayoutHandlers } from "../layoutHandlers";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { IWidgetBinding } from "@paperbits/common/editing";

export class LayoutViewModelBinder {
    constructor(private readonly viewModelBinderSelector: ViewModelBinderSelector) { }

    public modelToViewModel(model: LayoutModel, viewModel?: LayoutViewModel): LayoutViewModel {
        if (!viewModel) {
            viewModel = new LayoutViewModel();
        }

        const sectionViewModels = model.widgets
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

                if (!widgetViewModelBinder) {
                    return null;
                }

                return widgetViewModelBinder.modelToViewModel(widgetModel);
            })
            .filter(x => x !== null);

        viewModel.widgets(sectionViewModels);

        const binding: IWidgetBinding = {
            name: "layout",
            model: model,
            handler: LayoutHandlers,
            provides: ["static", "scripts", "keyboard"],
            applyChanges: () => this.modelToViewModel(model, viewModel)
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: LayoutModel): boolean {
        return model instanceof LayoutModel;
    }
}
