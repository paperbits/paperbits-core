import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { Button } from "./ko/button";
import { ButtonModelBinder } from "./buttonModelBinder";
import { ButtonViewModelBinder } from "./ko/buttonViewModelBinder";
import { ButtonModel } from "./buttonModel";
import { IWidgetService } from "@paperbits/common/widgets";
import { ButtonHandlers } from "./buttonHandlers";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";


export class ButtonPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("button", Button);
        injector.bindSingleton("buttonModelBinder", ButtonModelBinder);
        injector.bindSingleton("buttonViewModelBinder", ButtonViewModelBinder)
        injector.bindSingleton("buttonHandler", ButtonHandlers);

        const registry = injector.resolve<IWidgetService>("widgetService");

        registry.registerWidget("button", {
            modelDefinition: ButtonModel,
            componentBinder: KnockoutComponentBinder, 
            componentDefinition: Button,
            modelBinder: ButtonModelBinder,
            viewModelBinder: ButtonViewModelBinder
        });
    }
}