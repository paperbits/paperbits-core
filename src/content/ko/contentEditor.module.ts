import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ContentHandlers } from "../contentHandlers";

export class ContentEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bindToCollection("widgetHandlers", ContentHandlers, "pageHandlers");
    }
}