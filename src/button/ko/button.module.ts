import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { ButtonViewModel } from "./buttonViewModel";
import { ButtonModelBinder } from "../buttonModelBinder";
import { ButtonViewModelBinder } from "./buttonViewModelBinder";

export class ButtonModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bind("button", ButtonViewModel);
        injector.bind("buttonModelBinder", ButtonModelBinder);
        this.modelBinders.push(injector.resolve("buttonModelBinder"));
        
        injector.bind("buttonViewModelBinder", ButtonViewModelBinder);
        this.viewModelBinders.push(injector.resolve("buttonViewModelBinder"));
    }
}