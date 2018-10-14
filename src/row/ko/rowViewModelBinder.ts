import { RowViewModel } from "./rowViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { RowModel } from "../rowModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { RowHandlers } from "../rowHandlers";
import { IWidgetBinding } from "@paperbits/common/editing";

export class RowViewModelBinder implements IViewModelBinder<RowModel, RowViewModel> {
    constructor(private readonly viewModelBinderSelector: ViewModelBinderSelector) { }

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
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: RowModel): boolean {
        return model instanceof RowModel;
    }
}