import { IWidgetHandler } from "@paperbits/common/editing";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { TabPanelViewModel } from "./ko/tabPanel";
import { TabPanelEditor } from "./ko/tabPanelEditor";
import { TabPanelItemEditor } from "./ko/tabPanelItemEditor";
import { TabPanelItemSelector } from "./ko/tabPanelItemSelector";
import { TabPanelViewModelBinder } from "./ko/tabPanelViewModelBinder";
import { TabPanelItemViewModel } from "./ko/tabPanelItemViewModel";
import { TabPanelItemViewModelBinder } from "./ko/tabPanelItemViewModelBinder";
import { TabPanelHandlers } from "./tabPanelHandlers";
import { TabPanelItemHandlers } from "./tabPanelItemHandlers";
import { TabPanelModelBinder } from "./tabPanelModelBinder";
import { TabPanelItemModelBinder } from "./tabPanelItemModelBinder";
import { TabPanelStyleHandler } from "./tabPanelStyleHandler";
import { TabPanelModel, TabPanelItemModel } from "./tabPanelModel";

export class TabPanelDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        console.log("Registering TabPanel design module...");
        // TabPanel components
        injector.bind("tabPanel", TabPanelViewModel);
        injector.bind("tabPanelEditor", TabPanelEditor);
        injector.bindSingleton("tabPanelModelBinder", TabPanelModelBinder);
        injector.bindSingleton("tabPanelViewModelBinder", TabPanelViewModelBinder);
        injector.bindSingleton("tabPanelHandler", TabPanelHandlers);

        // TabPanelItem components
        injector.bind("tabPanelItem", TabPanelItemViewModel);
        injector.bind("tabPanelItemEditor", TabPanelItemEditor);
        injector.bind("tabPanelItemSelector", TabPanelItemSelector);
        injector.bindSingleton("tabPanelItemModelBinder", TabPanelItemModelBinder);
        injector.bindSingleton("tabPanelItemViewModelBinder", TabPanelItemViewModelBinder);
        injector.bindSingleton("tabPanelItemHandler", TabPanelItemHandlers);

        injector.bindToCollection("widgetHandlers", TabPanelItemHandlers, "tabPanelItemHandler");
        injector.bindToCollection("styleHandlers", TabPanelStyleHandler);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        // Register TabPanel widget
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

        // Register TabPanelItem widget
        widgetService.registerWidget("tabPanel-item", {
            modelDefinition: TabPanelItemModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TabPanelItemViewModel,
            modelBinder: TabPanelItemModelBinder,
            viewModelBinder: TabPanelItemViewModelBinder
        });

        widgetService.registerWidgetEditor("tabPanel-item", {
            displayName: "Tab",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TabPanelItemEditor,
            handlerComponent: TabPanelItemHandlers,
            selectable: false,
            draggable: false
        });
    }
}