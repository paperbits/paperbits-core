import { TabPanelViewModel } from "./tabPanel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { TabPanelItemModel, TabPanelModel } from "../tabPanelModel";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { TabPanelHandlers } from "../tabPanelHandlers";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { TabPanelItemViewModel } from "./tabPanelItemViewModel";
import { TabPanelItemHandlers } from "../tabPanelItemHandlers";


export class TabPanelViewModelBinder implements ViewModelBinder<TabPanelModel, TabPanelViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async itemModelToViewModel(model: TabPanelItemModel, index: number, viewModel?: TabPanelItemViewModel, bindingContext?: Bag<any>): Promise<TabPanelItemViewModel> {
        if (!viewModel) {
            viewModel = new TabPanelItemViewModel();
        }

        const viewModels = [];

        for (const widgetModel of model.widgets) {
            const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
            const widgetViewModel = await widgetViewModelBinder.modelToViewModel(widgetModel, null, bindingContext);

            viewModels.push(widgetViewModel);
        }

        const defaultLabel = `Tab ${index + 1}`;

        if (viewModels.length === 0) {
            viewModels.push(<any>new PlaceholderViewModel(defaultLabel));
        }

        viewModel.widgets(viewModels);
        viewModel.label(model.label || defaultLabel);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const binding: IWidgetBinding<TabPanelItemModel> = {
            name: "tabPanel-item",
            displayName: defaultLabel,
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "flex",
            editor: "tabPanel-item-editor",
            handler: TabPanelItemHandlers,
            applyChanges: async (changes) => {
                await this.itemModelToViewModel(model, index, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public async modelToViewModel(model: TabPanelModel, viewModel?: TabPanelViewModel, bindingContext?: Bag<any>): Promise<TabPanelViewModel> {
        if (!viewModel) {
            viewModel = new TabPanelViewModel();
        }

        const tabPanelItemViewModels = [];

        for (const [index, tabPanelItemModel] of model.tabPanelItems.entries()) {
            const tabPanelItemViewModel = await this.itemModelToViewModel(tabPanelItemModel, index, null, bindingContext);
            tabPanelItemViewModels.push(tabPanelItemViewModel);
        }

        if (tabPanelItemViewModels.length === 0) {
            tabPanelItemViewModels.push(<any>new PlaceholderViewModel("Tab panel"));
        }

        viewModel.tabPanelItems(tabPanelItemViewModels);
        viewModel.activeItemIndex(null);
        viewModel.activeItemIndex(0);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const binding: IWidgetBinding<TabPanelModel> = {
            name: "tab-panel",
            displayName: "Tab panel",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: "block",
            handler: TabPanelHandlers,
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: TabPanelModel): boolean {
        return model instanceof TabPanelModel;
    }
}