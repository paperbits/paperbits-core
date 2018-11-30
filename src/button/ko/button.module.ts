import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { Button } from "./buttonViewModel";
import { ButtonModelBinder } from "../buttonModelBinder";
import { ButtonViewModelBinder } from "./buttonViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class ButtonModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("button", Button);
        injector.bindToCollection<IModelBinder>("modelBinders", ButtonModelBinder);
        injector.bindToCollection("viewModelBinders", ButtonViewModelBinder);
    }
}