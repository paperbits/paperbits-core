import { IWidgetHandler } from "@paperbits/common/editing";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { TabPanelViewModel } from "./ko/tabPanel";
import { TabPanelEditor } from "./ko/tabPanelEditor";
import { TabPanelItemEditor } from "./ko/tabPanelItemEditor";
import { TabPanelItemSelector } from "./ko/tabPanelItemSelector";
import { TabPanelViewModelBinder } from "./ko/tabPanelViewModelBinder";
import { TabPanelHandlers } from "./tabPanelHandlers";
import { TabPanelItemHandlers } from "./tabPanelItemHandlers";
import { TabPanelModelBinder } from "./tabPanelModelBinder";
import { TabPanelStyleHandler } from "./tabPanelStyleHandler";
import { TabPanelModel } from "./tabPanelModel";

export class TabPanelDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tabPanel", TabPanelViewModel);
        injector.bind("tabPanelEditor", TabPanelEditor);
        injector.bind("tabPanelItemEditor", TabPanelItemEditor);
        injector.bind("tabPanelItemSelector", TabPanelItemSelector);
        injector.bindSingleton("tabPanelModelBinder", TabPanelModelBinder);
        injector.bindSingleton("tabPanelViewModelBinder", TabPanelViewModelBinder);
        injector.bindSingleton("tabPanelHandler", TabPanelHandlers);
        injector.bindToCollection("widgetHandlers", TabPanelItemHandlers, "tabPanelItemHandler");
        injector.bindToCollection("styleHandlers", TabPanelStyleHandler);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("tab-panel", {
            modelDefinition: TabPanelModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TabPanelViewModel,
            modelBinder: TabPanelModelBinder,
            viewModelBinder: TabPanelViewModelBinder
        });

        widgetService.registerWidgetEditor("tab-panel", {
            displayName: "Tab panel",
            iconClass: "widget-icon widget-icon-tab-panel",
            requires: ["js", "interaction"],
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TabPanelEditor,
            handlerComponent: TabPanelHandlers
        });
    }
}