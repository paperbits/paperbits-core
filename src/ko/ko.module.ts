import * as ko from "knockout";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { GridBindingHandler } from "./bindingHandlers/bindingHandlers.grid";
import { LightboxBindingHandler } from "./bindingHandlers/bindingHandlers.lightbox";
import { DraggablesBindingHandler } from "./bindingHandlers/bindingHandlers.draggables";
import { WidgetBindingHandler } from "./bindingHandlers/bindingHandlers.widget";
import { BackgroundBindingHandler } from "./bindingHandlers/bindingHandlers.background";

import "./knockout.editors";
import "./bindingHandlers/bindingHandlers.codeEditor";
import "./bindingHandlers/bindingHandlers.columnSizeCfg";
import "./bindingHandlers/bindingHandlers.component";
import "./bindingHandlers/bindingHandlers.highlight";
import "./bindingHandlers/bindingHandlers.splitter";
import "./bindingHandlers/bindingHandlers.resourcePicker";
import "./bindingHandlers/bindingHandlers.hyperlink";
import "./bindingHandlers/bindingHandlers.surface";
import "./bindingHandlers/bindingHandlers.gridCommand";
import "./bindingHandlers/bindingHandlers.align";
import "./bindingHandlers/bindingHandlers.size";
import "./bindingHandlers/bindingHandlers.validationMessageToggle";
import "./bindingHandlers/bindingHandlers.collapse";
import "./bindingHandlers/bindingHandlers.container";
import "./bindingHandlers/bindingHandlers.overflow";
import "./bindingHandlers/bindingHandlers.stickTo";
import "./bindingHandlers/bindingHandlers.scrollable";

export class KoModule implements IInjectorModule {
    public register(injector: IInjector): void {
        ko.virtualElements.allowedBindings["widget"] = true;
        ko.virtualElements.allowedBindings["layoutrow"] = true;
        ko.virtualElements.allowedBindings["component"] = true;     
    }
}