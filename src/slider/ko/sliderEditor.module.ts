import { IWidgetHandler } from "@paperbits/common/editing";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { SliderEditor } from "./sliderEditor";
import { SliderHandlers } from "../sliderHandlers";

export class SliderEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("sliderEditor", SliderEditor);
        // injector.bindToCollection<IWidgetHandler>("widgetHandlers", SliderHandlers, "sliderHandler");
    }
}