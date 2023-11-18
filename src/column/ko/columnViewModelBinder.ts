import * as Utils from "@paperbits/common/utils";
import { Bag } from "@paperbits/common";
import { ColumnViewModel } from "./columnViewModel";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { ColumnModel } from "../columnModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { ColumnHandlers } from "../columnHandlers";
import { EventManager, Events } from "@paperbits/common/events";
import { ComponentFlow } from "@paperbits/common/components";


export class ColumnViewModelBinder implements ViewModelBinder<ColumnModel, ColumnViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly widgetService: IWidgetService
    ) { }

    public async modelToViewModel(model: ColumnModel, viewModel?: ColumnViewModel, bindingContext?: Bag<any>): Promise<ColumnViewModel> {
        if (!viewModel) {
            viewModel = new ColumnViewModel();
        }

        const promises = model.widgets.map(widgetModel => {
            const definition = this.widgetService.getWidgetDefinitionForModel(widgetModel);

            if (definition) {
                const bindingPromise = this.widgetService.createWidgetBinding(definition, widgetModel, bindingContext);
                return bindingPromise;
            }

            // legacy binding resolution
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const bindingPromise = widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);
            return bindingPromise;
        });

        const widgetViewModels = await Promise.all(promises);

        viewModel.widgets(widgetViewModels);

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