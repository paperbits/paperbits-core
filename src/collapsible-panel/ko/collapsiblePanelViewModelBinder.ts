import { Bag } from "@paperbits/common";
import { IWidgetBinding } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { CollapsiblePanelHandlers } from "..";
import { ViewModelBinderSelector } from "../../ko";
import { PlaceholderViewModel } from "../../placeholder/ko";
import { CollapsiblePanelModel } from "../collapsiblePanelModel";
import { CollapsiblePanel } from "./collapsiblePanelViewModel";


export class CollapsiblePanelViewModelBinder implements ViewModelBinder<CollapsiblePanelModel, CollapsiblePanel>  {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly widgetService: IWidgetService
    ) { }

    public async modelToViewModel(model: CollapsiblePanelModel, viewModel?: CollapsiblePanel, bindingContext?: Bag<any>): Promise<CollapsiblePanel> {
        if (!viewModel) {
            viewModel = new CollapsiblePanel();
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

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Collapsible panel content"));
        }

        if (model.styles) {
            const styleModel = await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager);
            viewModel.styles(styleModel);
        }

        viewModel.widgets(widgetViewModels);

        const binding: IWidgetBinding<CollapsiblePanelModel, CollapsiblePanel> = {
            name: "collapiblePanel",
            displayName: "Collapsible panel",
            layer: bindingContext?.layer,
            model: model,
            draggable: true,
            flow: model?.version === "1.1.0" ? "inline" : "legacy",
            editor: "collapsible-panel-editor",
            handler: CollapsiblePanelHandlers,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: CollapsiblePanelModel): boolean {
        return model instanceof CollapsiblePanelModel;
    }
}