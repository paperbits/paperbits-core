import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CalendlyButton } from "./calendlyCalendlyButtonViewModel";
import { CalendlyButtonModelBinder } from "../calendlyCalendlyButtonModelBinder";
import { CalendlyButtonViewModelBinder } from "./calendlyCalendlyButtonViewModelBinder";


export class CalendlyButtonModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("calendlyCalendlyButton", CalendlyButton);
        injector.bindToCollection("modelBinders", CalendlyButtonModelBinder);
        injector.bindToCollection("viewModelBinders", CalendlyButtonViewModelBinder);
    }
}