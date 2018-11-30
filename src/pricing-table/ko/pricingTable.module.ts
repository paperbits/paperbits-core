import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PricingTableModelBinder } from "../pricingTableModelBinder";
import { PricingTableViewModelBinder } from "./pricingTableViewModelBinder";
import { PricingTableViewModel } from "./pricingTableViewModel";
import { IModelBinder } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";

export class PricingTableModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("pricingTable", PricingTableViewModel);
        injector.bindToCollection("modelBinders", PricingTableModelBinder);
        injector.bindToCollection("viewModelBinders", PricingTableViewModelBinder);
    }
}