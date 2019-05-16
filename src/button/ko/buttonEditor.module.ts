import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ButtonEditor } from "./buttonEditor";
import { ButtonHandlers } from "../buttonHandlers";

export class ButtonEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("buttonEditor", ButtonEditor);
        injector.bindToCollection("widgetHandlers", ButtonHandlers, "buttonHandler");
    }
}