import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { TabPanelViewModel } from "./ko/tabPanel";
import { TabPanelItemViewModel } from "./ko/tabPanelItemViewModel";
import { TabPanelModelBinder } from "./tabPanelModelBinder";
import { TabPanelItemModelBinder } from "./tabPanelItemModelBinder";
import { TabPanelViewModelBinder } from "./ko/tabPanelViewModelBinder";
import { TabPanelItemViewModelBinder } from "./ko/tabPanelItemViewModelBinder";
import { TabPanelStyleHandler } from "./tabPanelStyleHandler";
import { TabPanelModel, TabPanelItemModel } from "./tabPanelModel";

export class TabPanelPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tabPanel", TabPanelViewModel);
        injector.bind("tabPanelItem", TabPanelItemViewModel);
        injector.bindSingleton("tabPanelModelBinder", TabPanelModelBinder);
        injector.bindSingleton("tabPanelItemModelBinder", TabPanelItemModelBinder);
        injector.bindSingleton("tabPanelViewModelBinder", TabPanelViewModelBinder);
        injector.bindSingleton("tabPanelItemViewModelBinder", TabPanelItemViewModelBinder);
        injector.bindToCollection("styleHandlers", TabPanelStyleHandler);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("tab-panel", {
            modelDefinition: TabPanelModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TabPanelViewModel,
            modelBinder: TabPanelModelBinder,
            viewModelBinder: TabPanelViewModelBinder
        });

        widgetService.registerWidget("tabPanel-item", {
            modelDefinition: TabPanelItemModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TabPanelItemViewModel,
            modelBinder: TabPanelItemModelBinder,
            viewModelBinder: TabPanelItemViewModelBinder
        });
    }
}