import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { Button } from "./ko/button";
import { ButtonModelBinder } from "./buttonModelBinder";
import { ButtonViewModelBinder } from "./ko/buttonViewModelBinder";
import { ButtonModel } from "./buttonModel";
import { ComponentFlow } from "@paperbits/common/editing";
import { IWidgetService } from "@paperbits/common/widgets";
import { ButtonHandlers } from "./buttonHandlers";


export class ButtonPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("button", Button);
        injector.bindSingleton("buttonModelBinder", ButtonModelBinder);
        injector.bindSingleton("buttonViewModelBinder", ButtonViewModelBinder)
        injector.bindSingleton("buttonHandler", ButtonHandlers);

        const registry = injector.resolve<IWidgetService>("widgetService");

        registry.registerWidget("button", {
            modelClass: ButtonModel,
            componentFlow: ComponentFlow.Contents,
            componentBinder: "knockout", 
            componentBinderArguments: Button,
            modelBinder: ButtonModelBinder,
            viewModelBinder: ButtonViewModelBinder
        });
    }
}