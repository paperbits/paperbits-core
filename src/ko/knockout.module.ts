import * as ko from "knockout";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";

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

export class KoModule implements IInjectorModule {
    public register(injector: IInjector): void {
        ko.virtualElements.allowedBindings["widget"] = true;
        ko.virtualElements.allowedBindings["layoutrow"] = true;
        ko.virtualElements.allowedBindings["component"] = true;     
    }
}