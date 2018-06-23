import * as ko from "knockout";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { DocumentViewModel } from "../document/documentViewModel";
import { GridBindingHandler } from "./bindingHandlers/bindingHandlers.grid";
import { ViewManager, Tooltip } from "./ui";
import { ContentBindingHandler } from "./bindingHandlers/bindingHandlers.content";
import { LightboxBindingHandler } from "./bindingHandlers/bindingHandlers.lightbox";
import { DraggablesBindingHandler } from "./bindingHandlers/bindingHandlers.draggables";
import { WidgetBindingHandler } from "./bindingHandlers/bindingHandlers.widget";
import { BalloonBindingHandler } from "./bindingHandlers/bindingHandlers.balloon";
import { BackgroundBindingHandler } from "./bindingHandlers/bindingHandlers.background";
import { ResizableBindingHandler } from "./bindingHandlers/bindingHandlers.resizable";
import { KnockoutValidation } from "./validation/validators";
import "./knockout.editors";
import "./bindingHandlers/bindingHandlers.background";
import "./bindingHandlers/bindingHandlers.balloon";
import "./bindingHandlers/bindingHandlers.codeEditor";
import "./bindingHandlers/bindingHandlers.columnSize";
import "./bindingHandlers/bindingHandlers.component";
import "./bindingHandlers/bindingHandlers.content";
import "./bindingHandlers/bindingHandlers.draggables";
import "./bindingHandlers/bindingHandlers.highlight";
import "./bindingHandlers/bindingHandlers.splitter";
import "./bindingHandlers/bindingHandlers.lightbox";
import "./bindingHandlers/bindingHandlers.resourcePicker";
import "./bindingHandlers/bindingHandlers.hyperlink";
import "./bindingHandlers/bindingHandlers.surface";
import "./bindingHandlers/bindingHandlers.snapTo";
import "./bindingHandlers/bindingHandlers.gridCommand";
import "./bindingHandlers/bindingHandlers.align";
import "./bindingHandlers/bindingHandlers.validationMessageToggle";
import "./bindingHandlers/bindingHandlers.collapse";
import "./bindingHandlers/bindingHandlers.container";

export class KoModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindSingleton("viewManager", ViewManager);
        injector.bindComponent("tooltip", (ctx: IInjector, text: string) => { 
            return new Tooltip(text);
        });

        ko.virtualElements.allowedBindings["widget"] = true;
        ko.virtualElements.allowedBindings["layoutrow"] = true;
        ko.virtualElements.allowedBindings["component"] = true;

        injector.bindSingleton("contentBindingHandler", ContentBindingHandler);
        injector.bindSingleton("lighboxBindingHandler", LightboxBindingHandler);
        injector.bindSingleton("draggablesBindingHandler", DraggablesBindingHandler);
        injector.bindSingleton("widgetBindingHandler", WidgetBindingHandler);
        injector.bindSingleton("balloonBindingHandler", BalloonBindingHandler);
        injector.bindSingleton("backgroundBindingHandler", BackgroundBindingHandler);
        injector.bindSingleton("resizableBindingHandler", ResizableBindingHandler);
        injector.bindSingleton("knockoutValidation", KnockoutValidation);
        
        injector.bind("docWidget", DocumentViewModel);
        injector.bindSingleton("gridBindingHandler", GridBindingHandler);
    }
}