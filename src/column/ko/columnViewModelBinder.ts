import * as Utils from "@paperbits/common/utils";
import { ColumnViewModel } from "./columnViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { ColumnModel } from "../columnModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ColumnHandlers } from "../columnHandlers";
import { EventManager, Events } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";

export class ColumnViewModelBinder implements ViewModelBinder<ColumnModel, ColumnViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager
    ) { }

    private toTitleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private getAlignmentClass(styles: Object, alignmentString: string, targetBreakpoint: string): void {
        if (!alignmentString) {
            return;
        }

        const alignment = alignmentString.split(" ");
        const vertical = alignment[0];
        const horizontal = alignment[1];

        const x = styles["alignX"] || {};
        const y = styles["alignY"] || {};

        x[targetBreakpoint] = `utils/content/alignHorizontally${this.toTitleCase(horizontal)}`;
        y[targetBreakpoint] = `utils/content/alignVertically${this.toTitleCase(vertical)}`;

        styles["alignX"] = x;
        styles["alignY"] = y;
    }

    public async modelToViewModel(model: ColumnModel, columnViewModel?: ColumnViewModel, bindingContext?: Bag<any>): Promise<ColumnViewModel> {
        if (!columnViewModel) {
            columnViewModel = new ColumnViewModel();
        }

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            viewModels.push(widgetViewModel);
        }

        if (viewModels.length === 0) {
            viewModels.push(new PlaceholderViewModel("Column"));
        }

        columnViewModel.widgets(viewModels);

        if (model.size) {
            model.size = Utils.optimizeBreakpoints(model.size);
            columnViewModel.sizeXs(model.size.xs);
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

            // this.getAlignmentClass(styles, model.alignment.xs, "xs");
            // this.getAlignmentClass(styles, model.alignment.sm, "sm");
            // this.getAlignmentClass(styles, model.alignment.md, "md");
            // this.getAlignmentClass(styles, model.alignment.lg, "lg");
            // this.getAlignmentClass(styles, model.alignment.xl, "xl");
        }

        if (model.alignment) {
            model.alignment = Utils.optimizeBreakpoints(model.alignment);

            columnViewModel.alignmentXs(model.alignment.xs);
            columnViewModel.alignmentSm(model.alignment.sm);
            columnViewModel.alignmentMd(model.alignment.md);
            columnViewModel.alignmentLg(model.alignment.lg);
            columnViewModel.alignmentXl(model.alignment.xl);
        }

        if (model.offset) {
            model.offset = Utils.optimizeBreakpoints(model.offset);

            columnViewModel.offsetXs(model.offset.xs);
            columnViewModel.offsetSm(model.offset.sm);
            columnViewModel.offsetMd(model.offset.md);
            columnViewModel.offsetLg(model.offset.lg);
            columnViewModel.offsetXl(model.offset.xl);
        }

        if (model.order) {
            model.order = Utils.optimizeBreakpoints(model.order);
            columnViewModel.orderXs(model.order.xs);
            columnViewModel.orderSm(model.order.sm);
            columnViewModel.orderMd(model.order.md);
            columnViewModel.orderLg(model.order.lg);
            columnViewModel.orderXl(model.order.xl);
        }

        columnViewModel.overflowX(model.overflowX);
        columnViewModel.overflowY(model.overflowY);

        const binding: IWidgetBinding<ColumnModel, ColumnViewModel> = {
            name: "column",
            displayName: "Column",
            readonly: bindingContext ? bindingContext.readonly : false,
            flow: ComponentFlow.Inline,
            model: model,
            draggable: false,
            editor: "layout-column-editor",
            handler: ColumnHandlers,

            /**
             * editor: LayoutColumnEditor,
             * contextMenu: ColumnContextMenu,
             * type: "inline"
             */

            applyChanges: async () => {
                await this.modelToViewModel(model, columnViewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        columnViewModel["widgetBinding"] = binding;

        return columnViewModel;
    }

    public canHandleModel(model: ColumnModel): boolean {
        return model instanceof ColumnModel;
    }
}