import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { NavbarModule } from "./navbar.module";
import { NavbarEditor } from "./navbarEditor";
import { NavbarHandlers } from "../navbarHandlers";

export class NavbarEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new NavbarModule(this.modelBinders, this.viewModelBinders));
        
        injector.bind("navbarEditor", NavbarEditor);
        injector.bindSingleton("navbarHandler", NavbarHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<NavbarHandlers>("navbarHandler"));
    }
}