import { LayoutViewModel } from "./layoutViewModel";
import { LayoutModel } from "../layoutModel";
import { ViewModelBinderSelector } from "@paperbits/knockout/widgets/viewModelBinderSelector";

export class LayoutViewModelBinder {
    private readonly viewModelBinderSelector: ViewModelBinderSelector;

    constructor(viewModelBinderSelector: ViewModelBinderSelector) {
        this.viewModelBinderSelector = viewModelBinderSelector;
    }

    public modelToViewModel(model: LayoutModel, readonly: boolean, viewModel?: LayoutViewModel): LayoutViewModel {
        if (!viewModel) {
            viewModel = new LayoutViewModel();
        }

        let sectionViewModels = model.sections
            .map(widgetModel => {
                let widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);

                if (!widgetViewModelBinder) {
                    return null;
                }

                let widgetViewModel;

                // if (!readonly && widgetModel instanceof PageModel) {
                //     widgetViewModel = new PlaceholderViewModel();

                //     widgetViewModel["widgetBinding"] = {
                //         readonly: readonly,
                //         model: new PlaceholderModel()
                //     }
                // }
                // else {
                //     widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel, readonly);
                // }

                widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel, readonly);

                return widgetViewModel;
            })
            .filter(x => x != null);

        viewModel.widgets(sectionViewModels);

        viewModel["widgetBinding"] = {
            readonly: readonly,
            model: model,
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: LayoutModel): boolean {
        return model instanceof LayoutModel;
    }
}
