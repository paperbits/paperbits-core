import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { LayoutHandlers } from "../layoutHandlers";

export class LayoutEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("layoutHandler", LayoutHandlers);
        
        const widgetHandlers: IWidgetHandler[] = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<LayoutHandlers>("layoutHandler"));
    }
}