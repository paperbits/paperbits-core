import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { NavbarEditor } from "./navbarEditor";
import { NavbarHandlers } from "../navbarHandlers";

export class NavbarEditorModule implements IInjectorModule {
    register(injector: IInjector): void {        
        injector.bind("navbarEditor", NavbarEditor);
        injector.bindSingleton("navbarHandler", NavbarHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<NavbarHandlers>("navbarHandler"));
    }
}