import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { LayoutHandlers } from "../layoutHandlers";
import { LayoutWorkshopModule } from "../../workshops/layout/ko";


export class LayoutDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bindModule(new LayoutWorkshopModule());
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", LayoutHandlers, "layoutHandler");
    }
}