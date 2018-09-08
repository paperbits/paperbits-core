import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { ButtonEditor } from "./buttonEditor";
import { ButtonHandlers } from "../buttonHandlers";

export class ButtonEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("buttonEditor", ButtonEditor);
        injector.bindSingleton("buttonHandler", ButtonHandlers);

        const widgetHandlers: IWidgetHandler[] = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<ButtonHandlers>("buttonHandler"));
    }
}