import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { ButtonViewModel } from "./buttonViewModel";
import { ButtonModelBinder } from "../buttonModelBinder";
import { ButtonViewModelBinder } from "./buttonViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class ButtonModule implements IInjectorModule {
    register(injector: IInjector): void {        
        injector.bind("button", ButtonViewModel);
        injector.bind("buttonModelBinder", ButtonModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("buttonModelBinder"));
        
        injector.bind("buttonViewModelBinder", ButtonViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("buttonViewModelBinder"));
    }
}