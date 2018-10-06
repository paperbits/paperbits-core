import { ColumnViewModel } from "./columnViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { ColumnModel } from "../columnModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ColumnHandlers } from "../columnHandlers";

export class ColumnViewModelBinder implements IViewModelBinder<ColumnModel, ColumnViewModel> {
    constructor(private readonly viewModelBinderSelector: ViewModelBinderSelector) { }

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
        columnViewModel.sizeSm(model.sizeSm);
        columnViewModel.sizeMd(model.sizeMd);
        columnViewModel.sizeLg(model.sizeLg);
        columnViewModel.sizeXl(model.sizeXl);

        if (model.alignmentXs) {
            columnViewModel.alignmentXs(model.alignmentXs);
        }
        else {
            columnViewModel.alignmentXs("middle center");
        }

        if (model.alignmentSm) {
            columnViewModel.alignmentSm(model.alignmentSm);
        }
        else {
            columnViewModel.alignmentSm("middle center");
        }

        if (model.alignmentMd) {
            columnViewModel.alignmentMd(model.alignmentMd);
        }
        else {
            columnViewModel.alignmentMd("middle center");
        }

        if (model.alignmentLg) {
            columnViewModel.alignmentLg(model.alignmentLg);
        }
        else {
            columnViewModel.alignmentLg("middle center");
        }

        if (model.alignmentXl) {
            columnViewModel.alignmentXl(model.alignmentXl);
        }
        else {
            columnViewModel.alignmentXl("middle center");
        }

        columnViewModel.orderXs(model.orderXs);
        columnViewModel.orderSm(model.orderSm);
        columnViewModel.orderMd(model.orderMd);
        columnViewModel.orderLg(model.orderLg);
        columnViewModel.orderXl(model.orderXl);

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
            }
        };

        columnViewModel["widgetBinding"] = binding;

        return columnViewModel;
    }

    public canHandleModel(model: ColumnModel): boolean {
        return model instanceof ColumnModel;
    }
}