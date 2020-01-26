import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { ContentHandlers } from "../contentHandlers";

export class ContentEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", ContentHandlers, "pageHandlers");
    }
}