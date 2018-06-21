import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { SliderEditor } from "./sliderEditor";
import { SliderHandlers } from "../sliderHandlers";

export class SliderEditorModule implements IInjectorModule {

    register(injector: IInjector): void {
        injector.bind("sliderEditor", SliderEditor);
        injector.bindSingleton("sliderHandler", SliderHandlers);

        // const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        // widgetHandlers.push(injector.resolve<SliderHandlers>("sliderHandler"));
    }
}