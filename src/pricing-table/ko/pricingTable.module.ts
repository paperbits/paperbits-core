import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PricingTableModelBinder } from "../pricingTableModelBinder";
import { PricingTableViewModelBinder } from "./pricingTableViewModelBinder";
import { PricingTableViewModel } from "./pricingTableViewModel";
import { IModelBinder } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";

export class PricingTableModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("pricingTable", PricingTableViewModel);
        injector.bind("pricingTableModelBinder", PricingTableModelBinder);

        const modelBinders = injector.resolve<IModelBinder[]>("modelBinders");
        modelBinders.push(injector.resolve("pricingTableModelBinder"));

        injector.bind("pricingTableViewModelBinder", PricingTableViewModelBinder);
        
        const viewModelBinders = injector.resolve<IViewModelBinder<any, any>[]>("viewModelBinders");
        viewModelBinders.push(injector.resolve("pricingTableViewModelBinder"));
    }
}