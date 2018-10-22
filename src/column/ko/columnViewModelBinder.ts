import * as Utils from "@paperbits/common/utils";
import { ColumnViewModel } from "./columnViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { ColumnModel } from "../columnModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ColumnHandlers } from "../columnHandlers";
import { IEventManager } from "@paperbits/common/events";

export class ColumnViewModelBinder implements IViewModelBinder<ColumnModel, ColumnViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    public modelToViewModel(model: ColumnModel, columnViewModel?: ColumnViewModel): ColumnViewModel {
        if (!columnViewModel) {
            columnViewModel = new ColumnViewModel();
        }

        const widgetViewModels = model.widgets
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
                const widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel);

                return widgetViewModel;
            });

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Column"));
        }

        columnViewModel.widgets(widgetViewModels);

        if (model.size) {
            model.size = Utils.optimizeBreakpoints(model.size);
            columnViewModel.sizeSm(model.size.sm);
            columnViewModel.sizeMd(model.size.md);
            columnViewModel.sizeLg(model.size.lg);
            columnViewModel.sizeXl(model.size.xl);
        }

        if (model.alignment) {
            model.alignment = Utils.optimizeBreakpoints(model.alignment);
            columnViewModel.alignmentXs(model.alignment.xs);
            columnViewModel.alignmentSm(model.alignment.sm);
            columnViewModel.alignmentMd(model.alignment.md);
            columnViewModel.alignmentLg(model.alignment.lg);
            columnViewModel.alignmentXl(model.alignment.xl);
        }

        if (model.order) {
            model.order = Utils.optimizeBreakpoints(model.order);
            columnViewModel.orderXs(model.order.xs);
            columnViewModel.orderSm(model.order.sm);
            columnViewModel.orderMd(model.order.md);
            columnViewModel.orderLg(model.order.lg);
            columnViewModel.orderXl(model.order.xl);
        }

        const binding: IWidgetBinding = {
            name: "column",
            displayName: "Column",

            flow: "inline",
            model: model,
            editor: "layout-column-editor",
            handler: ColumnHandlers,

            /**
             * editor: LayoutColumnEditor,
             * contextMenu: ColumnContextMenu,
             * type: "inline"
             */

            applyChanges: () => {
                this.modelToViewModel(model, columnViewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        columnViewModel["widgetBinding"] = binding;

        return columnViewModel;
    }

    public canHandleModel(model: ColumnModel): boolean {
        return model instanceof ColumnModel;
    }
}