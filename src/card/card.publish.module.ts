import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CardViewModel } from "./ko/cardViewModel";
import { CardModelBinder } from "./cardModelBinder";
import { CardViewModelBinder } from "./ko/cardViewModelBinder";

export class CardPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("card", CardViewModel);
        injector.bindToCollection("modelBinders", CardModelBinder);
        injector.bindToCollection("viewModelBinders", CardViewModelBinder);
    }
}