import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { PricingTableEditor } from "./pricingTableEditor";
import { PricingTableHandlers } from "../pricingTableHandlers";


export class PricingTableEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("pricingTableEditor", PricingTableEditor);
        injector.bindSingleton("pricingTableDropHandler", PricingTableHandlers);

        const widgetHandlers: IWidgetHandler[] = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<PricingTableHandlers>("pricingTableDropHandler"));
    }
}