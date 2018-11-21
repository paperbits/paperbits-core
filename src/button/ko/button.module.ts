import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { Button } from "./buttonViewModel";
import { ButtonModelBinder } from "../buttonModelBinder";
import { ButtonViewModelBinder } from "./buttonViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class ButtonModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("button", Button);
        injector.bind("buttonModelBinder", ButtonModelBinder);
        const modelBinders = injector.resolve<IModelBinder[]>("modelBinders");
        modelBinders.push(injector.resolve("buttonModelBinder"));
        
        injector.bind("buttonViewModelBinder", ButtonViewModelBinder);
        const viewModelBinders = injector.resolve<IViewModelBinder<any, any>[]>("viewModelBinders");
        viewModelBinders.push(injector.resolve("buttonViewModelBinder"));
    }
}