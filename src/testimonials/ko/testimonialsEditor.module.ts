import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { TestimonialsEditor } from "./testimonialsEditor";
import { TestimonialsHandlers } from "../testimonialsHandlers";

export class TestimonialsEditorModule implements IInjectorModule {

    register(injector: IInjector): void {
        injector.bind("testimonialsEditor", TestimonialsEditor);
        injector.bindSingleton("testimonialsHandler", TestimonialsHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<TestimonialsHandlers>("testimonialsHandler"));
    }
}