import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CardViewModel } from "./cardViewModel";
import { CardModelBinder } from "../cardModelBinder";
import { CardViewModelBinder } from "./cardViewModelBinder";

export class CardModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("card", CardViewModel);
        injector.bindToCollection("modelBinders", CardModelBinder);
        injector.bindToCollection("viewModelBinders", CardViewModelBinder);
    }
}