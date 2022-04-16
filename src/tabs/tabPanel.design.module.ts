import { IWidgetHandler } from "@paperbits/common/editing";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { TabPanelViewModel } from "./ko/tabPanel";
import { TabPanelEditor } from "./ko/tabPanelEditor";
import { TabPanelItemEditor } from "./ko/tabPanelItemEditor";
import { TabPanelItemSelector } from "./ko/tabPanelItemSelector";
import { TabPanelViewModelBinder } from "./ko/tabPanelViewModelBinder";
import { TabPanelHandlers } from "./tabPanelHandlers";
import { TabPanelItemHandlers } from "./tabPanelItemHandlers";
import { TabPanelModelBinder } from "./tabPanelModelBinder";
import { TabPanelStyleHandler } from "./tabPanelStyleHandler";

export class TabPanelDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tabPanel", TabPanelViewModel);
        injector.bind("tabPanelEditor", TabPanelEditor);
        injector.bind("tabPanelItemEditor", TabPanelItemEditor);
        injector.bind("tabPanelItemSelector", TabPanelItemSelector);
        injector.bindToCollection("modelBinders", TabPanelModelBinder, "tabPanelModelBinder");
        injector.bindToCollection("viewModelBinders", TabPanelViewModelBinder);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", TabPanelHandlers, "tabPanelHandler");
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", TabPanelItemHandlers, "tabPanelItemHandler");
        injector.bindToCollection("styleHandlers", TabPanelStyleHandler);
    }
}