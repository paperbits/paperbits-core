import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CollapsiblePanel } from "./collapsiblePanelViewModel";
import { CollapsiblePanelModelBinder } from "../collapsiblePanelModelBinder";
import { CollapsiblePanelViewModelBinder } from "./collapsiblePanelViewModelBinder";

export class CollapsiblePanelModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("collapsiblePanel", CollapsiblePanel);
        injector.bindToCollection("modelBinders", CollapsiblePanelModelBinder);
        injector.bindToCollection("viewModelBinders", CollapsiblePanelViewModelBinder);
    }
}