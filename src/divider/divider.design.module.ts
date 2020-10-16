import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { DividerEditor } from "./ko/dividerEditor";
import { DividerHandlers } from "./dividerHandlers";
import { Divider, DividerViewModelBinder } from "./ko";
import { DividerModelBinder } from "./dividerModelBinder";

export class DividerDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("dividerEditor", DividerEditor);
        injector.bindToCollection("widgetHandlers", DividerHandlers, "dividerHandler");
        injector.bind("divider", Divider);
        injector.bindToCollection("modelBinders", DividerModelBinder);
        injector.bindToCollection("viewModelBinders", DividerViewModelBinder);
    }
}