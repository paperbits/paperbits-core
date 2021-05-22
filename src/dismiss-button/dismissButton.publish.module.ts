import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { DismissButton } from "./ko/dismissButtonViewModel";
import { DismissButtonModelBinder } from "./dismissButtonModelBinder";
import { DismissButtonViewModelBinder } from "./ko/dismissButtonViewModelBinder";


export class DismissButtonPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("dismissButton", DismissButton);
        injector.bindToCollection("modelBinders", DismissButtonModelBinder);
        injector.bindToCollection("viewModelBinders", DismissButtonViewModelBinder);
    }
}