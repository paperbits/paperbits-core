import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PictureEditor } from "./pictureEditor";
import { PictureHandlers } from "../pictureHandlers";
import { PictureModule } from "./picture.module";

export class PictureEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new PictureModule(this.modelBinders, this.viewModelBinders));

        injector.bind("pictureEditor", PictureEditor);
        injector.bindSingleton("pictureDropHandler", PictureHandlers);

        const dropHandlers:Array<IContentDropHandler> = injector.resolve("dropHandlers");
        dropHandlers.push(injector.resolve<PictureHandlers>("pictureDropHandler"));

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<PictureHandlers>("pictureDropHandler"));
    }
}