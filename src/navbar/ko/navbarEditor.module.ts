import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { NavbarEditor } from "./navbarEditor";
import { NavbarHandlers } from "../navbarHandlers";

export class NavbarEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("navbarEditor", NavbarEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", NavbarHandlers, "navbarHandler");
    }
}