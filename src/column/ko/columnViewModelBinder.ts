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

    public async modelToViewModel(model: ColumnModel, viewModel?: ColumnViewModel, bindingContext?: Bag<any>): Promise<ColumnViewModel> {
        if (!viewModel) {
            viewModel = new ColumnViewModel();
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

        viewModel.widgets(viewModels);

        if (model.size) {
            model.size = Utils.optimizeBreakpoints(model.size);
            viewModel.sizeXs(model.size.xs);
            viewModel.sizeSm(model.size.sm);
            viewModel.sizeMd(model.size.md);
            viewModel.sizeLg(model.size.lg);
            viewModel.sizeXl(model.size.xl);
        }

        if (model.alignment) {
            model.alignment = Utils.optimizeBreakpoints(model.alignment);

            viewModel.alignmentXs(model.alignment.xs);
            viewModel.alignmentSm(model.alignment.sm);
            viewModel.alignmentMd(model.alignment.md);
            viewModel.alignmentLg(model.alignment.lg);
            viewModel.alignmentXl(model.alignment.xl);

            // this.getAlignmentClass(styles, model.alignment.xs, "xs");
            // this.getAlignmentClass(styles, model.alignment.sm, "sm");
            // this.getAlignmentClass(styles, model.alignment.md, "md");
            // this.getAlignmentClass(styles, model.alignment.lg, "lg");
            // this.getAlignmentClass(styles, model.alignment.xl, "xl");
        }

        if (model.alignment) {
            model.alignment = Utils.optimizeBreakpoints(model.alignment);

            viewModel.alignmentXs(model.alignment.xs);
            viewModel.alignmentSm(model.alignment.sm);
            viewModel.alignmentMd(model.alignment.md);
            viewModel.alignmentLg(model.alignment.lg);
            viewModel.alignmentXl(model.alignment.xl);
        }

        if (model.offset) {
            model.offset = Utils.optimizeBreakpoints(model.offset);

            viewModel.offsetXs(model.offset.xs);
            viewModel.offsetSm(model.offset.sm);
            viewModel.offsetMd(model.offset.md);
            viewModel.offsetLg(model.offset.lg);
            viewModel.offsetXl(model.offset.xl);
        }

        if (model.order) {
            model.order = Utils.optimizeBreakpoints(model.order);
            viewModel.orderXs(model.order.xs);
            viewModel.orderSm(model.order.sm);
            viewModel.orderMd(model.order.md);
            viewModel.orderLg(model.order.lg);
            viewModel.orderXl(model.order.xl);
        }

        viewModel.overflowX(model.overflowX);
        viewModel.overflowY(model.overflowY);

        const binding: IWidgetBinding<ColumnModel, ColumnViewModel> = {
            name: "column",
            displayName: "Column",
            layer: bindingContext?.layer,
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
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: ColumnModel): boolean {
        return model instanceof ColumnModel;
    }
}