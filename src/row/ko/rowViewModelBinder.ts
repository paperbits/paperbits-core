import { RowViewModel } from "./rowViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { RowModel } from "../rowModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { RowHandlers } from "../rowHandlers";
import { IWidgetBinding } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";

export class RowViewModelBinder implements ViewModelBinder<RowModel, RowViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager
    ) { }

    public async modelToViewModel(model: RowModel, viewModel?: RowViewModel, bindingContext?: Bag<any>): Promise<RowViewModel> {
        if (!viewModel) {
            viewModel = new RowViewModel();
        }

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            viewModels.push(widgetViewModel);
        }

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

        const binding: IWidgetBinding<RowModel, RowViewModel> = {
            name: "row",
            displayName: "Row",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: false,
            handler: RowHandlers,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: RowModel): boolean {
        return model instanceof RowModel;
    }
}