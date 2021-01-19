import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TabPanelHTMLElement } from "./ko/runtime/tab-panel-runtime";

export class TabPanelRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        const tabPanelComponentName = "tab-panel-runtime";
        customElements.define(tabPanelComponentName, TabPanelHTMLElement);
    }
}

