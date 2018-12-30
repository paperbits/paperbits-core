import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CardEditor } from "./cardEditor";
import { IWidgetHandler } from "@paperbits/common/editing";
import { CardHandlers } from "../cardHandlers";

export class CardEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("cardEditor", CardEditor);
        injector.bind("cardHandler", CardHandlers);

        const widgetHandlers: IWidgetHandler[] = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<CardHandlers>("cardHandler"));
    }
}