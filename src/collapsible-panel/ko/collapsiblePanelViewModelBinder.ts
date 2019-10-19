import { CollapsiblePanel } from "./collapsiblePanelViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { CollapsiblePanelModel } from "../collapsiblePanelModel";
import { EventManager } from "@paperbits/common/events";
import { IStyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { PlaceholderViewModel } from "../../placeholder/ko";
import { ViewModelBinderSelector } from "../../ko";
import { CollapsiblePanelHandlers } from "..";


export class CollapsiblePanelViewModelBinder implements ViewModelBinder<CollapsiblePanelModel, CollapsiblePanel>  {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: IStyleCompiler
    ) { }

    public async modelToViewModel(model: CollapsiblePanelModel, viewModel?: CollapsiblePanel, bindingContext?: Bag<any>): Promise<CollapsiblePanel> {
        if (!viewModel) {
            viewModel = new CollapsiblePanel();
        }

        const widgetViewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            widgetViewModels.push(widgetViewModel);
        }

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Content"));
        }

        if (model.styles) {
            const styleModel = await this.styleCompiler.getStyleModelAsync(model.styles);
            viewModel.styles(styleModel);
        }

        viewModel.widgets(widgetViewModels);

        viewModel["widgetBinding"] = {
            displayName: "Collapsible panel",
            model: model,
            flow: "inline",
            editor: "collapsible-panel-editor",
            handler: CollapsiblePanelHandlers,
            applyChanges: async (changes) => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: CollapsiblePanelModel): boolean {
        return model instanceof CollapsiblePanelModel;
    }
}