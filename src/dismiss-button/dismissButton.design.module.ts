import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { DismissButtonEditor } from "./ko/dismissButtonEditor";
import { DismissButtonHandlers } from "./dismissButtonHandlers";
import { DismissButton, DismissButtonViewModelBinder } from "./ko";
import { DismissButtonModelBinder } from "./dismissButtonModelBinder";

export class DismissButtonDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("dsmissButtonEditor", DismissButtonEditor);
        injector.bindToCollection("widgetHandlers", DismissButtonHandlers, "dismissButtonHandler");

        injector.bind("dismissButton", DismissButton);
        injector.bindToCollection("modelBinders", DismissButtonModelBinder);
        injector.bindToCollection("viewModelBinders", DismissButtonViewModelBinder);
    }
}