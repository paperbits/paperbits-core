import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { LayoutHandlers } from "../layoutHandlers";

export class LayoutEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", LayoutHandlers, "layoutHandler");
    }
}