import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { ButtonEditor } from "./buttonEditor";
import { ButtonHandlers } from "../buttonHandlers";

export class ButtonEditorModule implements IInjectorModule {
    register(injector: IInjector): void {        
        injector.bind("buttonEditor", ButtonEditor);
        injector.bindSingleton("buttonHandler", ButtonHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<ButtonHandlers>("buttonHandler"));
    }
}