import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { PageHandlers } from "../pageHandlers";

export class PageEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("pageHandler", PageHandlers);
        
        const widgetHandlers: IWidgetHandler[] = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<PageHandlers>("pageHandler"));
    }
}