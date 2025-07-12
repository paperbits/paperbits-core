import { TabPanelViewModel } from "./tabPanel";
import { IWidgetService, ViewModelBinder } from "@paperbits/common/widgets";
import { TabPanelItemModel, TabPanelModel } from "../tabPanelModel";
import { Placeholder } from "../../placeholder/ko/placeholder";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { StyleCompiler } from "@paperbits/common/styles";
import { Bag } from "@paperbits/common";
import { TabPanelItemViewModel } from "./tabPanelItemViewModel";
import * as ko from "knockout";


export class TabPanelViewModelBinder implements ViewModelBinder<TabPanelModel, TabPanelViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
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

            // Create widget binding through the service
            const widgetBinding = await this.widgetService.createWidgetBinding(definition, tabPanelItemModel, bindingContext);

            const labelObservable = ko.observable((<any>widgetBinding).model.label || `Tab ${index + 1}`);

            widgetBinding.addChangeListener((model: TabPanelItemModel) => {
                labelObservable(model.label);
            });

            tabPanelItemViewModels.push(widgetBinding);
            tabLabels.push(labelObservable)
        }

        if (tabPanelItemViewModels.length === 0) {
            tabPanelItemViewModels.push(<any>new Placeholder("Tab panel"));
            tabLabels.push("Tab panel");
        }

        state.tabPanelItems = tabPanelItemViewModels;
        state.tabLabels = tabLabels;

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager);
        }
    }
}