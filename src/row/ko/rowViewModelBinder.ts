import { RowViewModel } from "./rowViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { RowModel } from "../rowModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { RowHandlers } from "../rowHandlers";
import { IWidgetBinding } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";

export class RowViewModelBinder implements IViewModelBinder<RowModel, RowViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    public modelToViewModel(model: RowModel, viewModel?: RowViewModel): RowViewModel {
        if (!viewModel) {
            viewModel = new RowViewModel();
        }

        const viewModels = model.widgets
            .map(widgetModel => {
                const viewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
                const viewModel = viewModelBinder.modelToViewModel(widgetModel);

                return viewModel;
            });

        if (viewModels.length === 0) {
            viewModels.push(<any>new PlaceholderViewModel("Row"));
        }

        viewModel.widgets(viewModels);

        viewModel.alignSm(model.alignSm);
        viewModel.alignMd(model.alignMd);
        viewModel.alignLg(model.alignLg);

        viewModel.justifySm(model.justifySm);
        viewModel.justifyMd(model.justifyMd);
        viewModel.justifyLg(model.justifyLg);

        const binding: IWidgetBinding = {
            name: "row",
            displayName: "Row",
            model: model,
            handler: RowHandlers,
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: RowModel): boolean {
        return model instanceof RowModel;
    }
}