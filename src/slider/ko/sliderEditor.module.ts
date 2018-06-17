import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { SliderModule } from "./slider.module";
import { SliderEditor } from "./sliderEditor";
import { SliderHandlers } from "../sliderHandlers";

export class SliderEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bindModule(new SliderModule(this.modelBinders, this.viewModelBinders));
        injector.bind("sliderEditor", SliderEditor);
        injector.bindSingleton("sliderHandler", SliderHandlers);

        // const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        // widgetHandlers.push(injector.resolve<SliderHandlers>("sliderHandler"));
    }
}