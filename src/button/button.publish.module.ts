import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { Button } from "./ko/button";
import { ButtonModelBinder } from "./buttonModelBinder";
import { ButtonViewModelBinder } from "./ko/buttonViewModelBinder";


export class ButtonPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("button", Button);
        injector.bindToCollection("modelBinders", ButtonModelBinder);
        injector.bindToCollection("viewModelBinders", ButtonViewModelBinder);
    }
}