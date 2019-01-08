import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { TestimonialsEditor } from "./testimonialsEditor";
import { TestimonialsHandlers } from "../testimonialsHandlers";

export class TestimonialsEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("testimonialsEditor", TestimonialsEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", TestimonialsHandlers, "testimonialsHandler");
    }
}