import { TabPanelViewModel } from "./tabPanel";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { TabPanelItemModel, TabPanelModel } from "../tabPanelModel";
import { Placeholder } from "../../placeholder/ko/placeholder";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { TabPanelItemViewModel } from "./tabPanelItemViewModel";


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
        
        // Set tab labels directly instead of computing from view models
        if (state.tabLabels) {
            componentInstance.tabLinks(state.tabLabels);
        }
    }

    public async modelToState(model: TabPanelModel, state: any, bindingContext: Bag<any>): Promise<void> {
        const tabPanelItemViewModels = [];
        const tabLabels = [];

        for (const [index, tabPanelItemModel] of model.tabPanelItems.entries()) {
            const definition = this.widgetService.getWidgetDefinitionForModel(tabPanelItemModel);

            if (definition) {
                // Create widget binding through the service
                const widgetBinding = await this.widgetService.createWidgetBinding(definition, tabPanelItemModel, bindingContext);
                tabPanelItemViewModels.push(widgetBinding);
            } else {
                // fallback to direct processing if not registered as widget
                const tabPanelItemViewModel = await this.itemModelToViewModel(tabPanelItemModel, index, null, bindingContext);
                tabPanelItemViewModels.push(tabPanelItemViewModel);
            }

            // Extract label from model for tab navigation
            const defaultLabel = `Tab ${index + 1}`;
            tabLabels.push(tabPanelItemModel.label || defaultLabel);
        }

        if (tabPanelItemViewModels.length === 0) {
            tabPanelItemViewModels.push(<any>new Placeholder("Tab panel"));
            tabLabels.push("Tab panel");
        }

        state.tabPanelItems = tabPanelItemViewModels;
        state.tabLabels = tabLabels;

        
        // binding["setActiveItem"] = (index: number) => viewModel.activeItemIndex(index);
        // binding["getActiveItem"] = () => parseInt(<any>viewModel.activeItemIndex());
        // viewModel["widgetBinding"] = binding;
        // viewModel.activeItemIndex(0);

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager);
        }
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

        return viewModel;
    }

    public canHandleModel(model: TabPanelModel): boolean {
        return model instanceof TabPanelModel;
    }
}