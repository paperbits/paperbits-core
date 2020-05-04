import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CalendlyButton } from "./calendlyButtonViewModel";
import { CalendlyButtonModelBinder } from "../calendlyButtonModelBinder";
import { CalendlyButtonViewModelBinder } from "./calendlyButtonViewModelBinder";


export class CalendlyButtonModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("calendlyButton", CalendlyButton);
        injector.bindToCollection("modelBinders", CalendlyButtonModelBinder);
        injector.bindToCollection("viewModelBinders", CalendlyButtonViewModelBinder);
    }
}