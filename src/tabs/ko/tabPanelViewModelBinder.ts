import { TabPanelViewModel } from "./tabPanel";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { TabPanelItemModel, TabPanelModel } from "../tabPanelModel";
import { Placeholder } from "../../placeholder/ko/placeholder";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { TabPanelHandlers } from "../tabPanelHandlers";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { TabPanelItemViewModel } from "./tabPanelItemViewModel";
import { TabPanelItemHandlers } from "../tabPanelItemHandlers";
import { ComponentFlow } from "@paperbits/common/components";


export class TabPanelViewModelBinder implements ViewModelBinder<TabPanelModel, TabPanelViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly widgetService: IWidgetService
    ) { }

    public stateToInstance(state: any, componentInstance: TabPanelViewModel): void {
        componentInstance.styles(state.styles);
        componentInstance.tabPanelItems(state.tabPanelItems);
    }

    public async modelToState(model: TabPanelModel, state: any, bindingContext: Bag<any>): Promise<void> {
        const tabPanelItemViewModels = [];

        for (const [index, tabPanelItemModel] of model.tabPanelItems.entries()) {
            const tabPanelItemViewModel = await this.itemModelToViewModel(tabPanelItemModel, index, null, bindingContext);
            tabPanelItemViewModels.push(tabPanelItemViewModel);
        }

        if (tabPanelItemViewModels.length === 0) {
            tabPanelItemViewModels.push(<any>new Placeholder("Tab panel"));
        }

        state.tabPanelItems = tabPanelItemViewModels;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager);
        }
    }

    private createBinding(model: TabPanelModel, viewModel?: TabPanelViewModel, bindingContext?: Bag<any>): void {
        const binding: IWidgetBinding<TabPanelModel, TabPanelViewModel> = {
            name: "tab-panel",
            displayName: "Tab panel",
            layer: bindingContext?.layer,
            model: model,
            draggable: true,
            flow: ComponentFlow.Block,
            handler: TabPanelHandlers,
            editor: "tab-panel-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        binding["setActiveItem"] = (index: number) => viewModel.activeItemIndex(index);
        binding["getActiveItem"] = () => parseInt(<any>viewModel.activeItemIndex());
        viewModel["widgetBinding"] = binding;
        viewModel.activeItemIndex(0);
    }

    public async itemModelToViewModel(model: TabPanelItemModel, index: number, viewModel?: TabPanelItemViewModel, bindingContext?: Bag<any>): Promise<TabPanelItemViewModel> {
        if (!viewModel) {
            viewModel = new TabPanelItemViewModel();
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

        const viewModels = await Promise.all(promises);

        const defaultLabel = `Tab ${index + 1}`;

        if (viewModels.length === 0) {
            viewModels.push(<any>new Placeholder(defaultLabel));
        }

        viewModel.widgets(viewModels);
        viewModel.label(model.label || defaultLabel);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const binding: IWidgetBinding<TabPanelItemModel, TabPanelItemViewModel> = {
            name: "tabPanel-item",
            displayName: defaultLabel,
            layer: bindingContext?.layer,
            model: model,
            draggable: true,
            editor: "tabPanel-item-editor",
            handler: TabPanelItemHandlers,
            applyChanges: async () => {
                await this.itemModelToViewModel(model, index, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public async modelToViewModel(model: TabPanelModel, viewModel?: TabPanelViewModel, bindingContext?: Bag<any>): Promise<TabPanelViewModel> {
        if (!viewModel) {
            viewModel = new TabPanelViewModel();
            this.createBinding(model, viewModel, bindingContext);
        }

        const tabPanelItemViewModels = [];

        for (const [index, tabPanelItemModel] of model.tabPanelItems.entries()) {
            const tabPanelItemViewModel = await this.itemModelToViewModel(tabPanelItemModel, index, null, bindingContext);
            tabPanelItemViewModels.push(tabPanelItemViewModel);
        }

        if (tabPanelItemViewModels.length === 0) {
            tabPanelItemViewModels.push(<any>new Placeholder("Tab panel"));
        }

        viewModel.tabPanelItems(tabPanelItemViewModels);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        return viewModel;
    }

    public canHandleModel(model: TabPanelModel): boolean {
        return model instanceof TabPanelModel;
    }
}