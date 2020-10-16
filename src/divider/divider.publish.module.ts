import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { Divider } from "./ko/dividerViewModel";
import { DividerModelBinder } from "./dividerModelBinder";
import { DividerViewModelBinder } from "./ko/dividerViewModelBinder";


export class DividerPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("divider", Divider);
        injector.bindToCollection("modelBinders", DividerModelBinder);
        injector.bindToCollection("viewModelBinders", DividerViewModelBinder);
    }
}