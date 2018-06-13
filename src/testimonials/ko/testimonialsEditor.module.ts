import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { TestimonialsModule } from "./testimonials.module";
import { TestimonialsEditor } from "./testimonialsEditor";
import { TestimonialsHandlers } from "../testimonialsHandlers";

export class TestimonialsEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new TestimonialsModule(this.modelBinders, this.viewModelBinders));

        injector.bind("testimonialsEditor", TestimonialsEditor);
        injector.bindSingleton("testimonialsHandler", TestimonialsHandlers);

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<TestimonialsHandlers>("testimonialsHandler"));
    }
}