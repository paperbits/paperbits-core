import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { CardViewModel } from "./cardViewModel";
import { CardModelBinder } from "../cardModelBinder";
import { CardViewModelBinder } from "./cardViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class CardModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("card", CardViewModel);
        injector.bindToCollection<IModelBinder>("modelBinders", CardModelBinder);
        injector.bindToCollection("viewModelBinders", CardViewModelBinder);
    }
}