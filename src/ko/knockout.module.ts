import * as ko from "knockout";
import { Bag } from "@paperbits/common";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ComponentBinder } from "@paperbits/common/editing/componentBinder";

import "./bindingHandlers/bindingHandlers.columnSizeCfg";
import "./bindingHandlers/bindingHandlers.component";
import "./bindingHandlers/bindingHandlers.highlight";
import "./bindingHandlers/bindingHandlers.splitter";
import "./bindingHandlers/bindingHandlers.hyperlink";
import "./bindingHandlers/bindingHandlers.gridCommand";
import "./bindingHandlers/bindingHandlers.align";
import "./bindingHandlers/bindingHandlers.focus";
import "./bindingHandlers/bindingHandlers.size";
import "./bindingHandlers/bindingHandlers.validationMessageToggle";
import "./bindingHandlers/bindingHandlers.tooltip";
import "./bindingHandlers/bindingHandlers.collapse";
import "./bindingHandlers/bindingHandlers.stickTo";
import "./bindingHandlers/bindingHandlers.scrollable";
import "./bindingHandlers/bindingHandlers.secured";
import "./bindingHandlers/bindingHandlers.slider";
import "./bindingHandlers/bindingHandlers.angle";
import "./bindingHandlers/bindingHandlers.srcset";
import "./bindingHandlers/bindingHandlers.confirm";
import "./bindingHandlers/bindingHandlers.gridCell";
import "./bindingHandlers/bindingHandlers.selectable";
import "./bindingExtenders/bindingExtenders.max";
import { KnockoutComponentBinder } from "./knockoutComponentBinder";

export class KnockoutModule implements IInjectorModule {
    public register(injector: IInjector): void {
        ko.virtualElements.allowedBindings["widget"] = true;
        ko.virtualElements.allowedBindings["layoutrow"] = true;
        ko.virtualElements.allowedBindings["component"] = true;     

        const componentBinders = injector.resolve<Bag<ComponentBinder>>("componentBinders");
        componentBinders["knockout"] = new KnockoutComponentBinder();
    }
}