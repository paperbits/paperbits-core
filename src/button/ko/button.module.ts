import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { Button } from "./button";
import { ButtonModelBinder } from "../buttonModelBinder";
import { ButtonViewModelBinder } from "./buttonViewModelBinder";


export class ButtonModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("button", Button);
        injector.bindToCollection("modelBinders", ButtonModelBinder);
        injector.bindToCollection("viewModelBinders", ButtonViewModelBinder);
    }
}