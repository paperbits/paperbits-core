import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { TabPanelViewModel } from "./ko/tabPanel";
import { TabPanelModelBinder } from "./tabPanelModelBinder";
import { TabPanelViewModelBinder } from "./ko/tabPanelViewModelBinder";
import { TabPanelStyleHandler } from "./tabPanelStyleHandler";
import { TabPanelModel } from "./tabPanelModel";

export class TabPanelPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tabPanel", TabPanelViewModel);
        injector.bindSingleton("tabPanelModelBinder", TabPanelModelBinder);
        injector.bindSingleton("tabPanelViewModelBinder", TabPanelViewModelBinder);
        injector.bindToCollection("styleHandlers", TabPanelStyleHandler);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("tab-panel", {
            modelDefinition: TabPanelModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TabPanelViewModel,
            modelBinder: TabPanelModelBinder,
            viewModelBinder: TabPanelViewModelBinder
        });
    }
}