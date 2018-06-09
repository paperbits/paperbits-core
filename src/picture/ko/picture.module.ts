import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PictureModelBinder } from "../pictureModelBinder";
import { PictureViewModelBinder } from "./pictureViewModelBinder";
import { PictureEditor } from "./pictureEditor";
import { PictureHandlers } from "../pictureHandlers";
import { PictureViewModel } from "./pictureViewModel";

export class PictureModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bind("picture", PictureViewModel);
        //modelBinders
        injector.bind("pictureModelBinder", PictureModelBinder);     
        this.modelBinders.push(injector.resolve("pictureModelBinder"));

        //viewModelBinders
        injector.bind("pictureViewModelBinder", PictureViewModelBinder);
        this.viewModelBinders.push(injector.resolve("pictureViewModelBinder"));

        //editors        
        injector.bind("pictureEditor", PictureEditor);

        //handlers        
        injector.bindSingleton("pictureDropHandler", PictureHandlers);

        const dropHandlers:Array<IContentDropHandler> = injector.resolve("dropHandlers");
        dropHandlers.push(injector.resolve<PictureHandlers>("pictureDropHandler"));

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<PictureHandlers>("pictureDropHandler"));
    }
}