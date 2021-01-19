import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TabPanelViewModel } from "./ko/tabPanel";
import { TabPanelModelBinder } from "./tabPanelModelBinder";
import { TabPanelViewModelBinder } from "./ko/tabPanelViewModelBinder";
import { TabPanelStyleHandler } from "./tabPanelStyleHandler";

export class TabPanelPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tabPanel", TabPanelViewModel);
        injector.bindToCollection("modelBinders", TabPanelModelBinder, "tabPanelModelBinder");
        injector.bindToCollection("viewModelBinders", TabPanelViewModelBinder);
        injector.bindToCollection("styleHandlers", TabPanelStyleHandler);
    }
}