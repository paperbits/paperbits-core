import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { ButtonModule } from "./button.module";
import { ButtonEditor } from "./buttonEditor";
import { ButtonHandlers } from "../buttonHandlers";

export class ButtonEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new ButtonModule(this.modelBinders, this.viewModelBinders));
        
        injector.bind("buttonEditor", ButtonEditor);
        injector.bindSingleton("buttonHandler", ButtonHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<ButtonHandlers>("buttonHandler"));
    }
}