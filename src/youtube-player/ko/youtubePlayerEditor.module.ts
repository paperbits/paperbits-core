import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { YoutubeEditor } from "./youtubeEditor";
import { YoutubeHandlers } from "../youtubeHandlers";
import { YoutubePlayerModule } from "./youtubePlayer.module";

export class YoutubePlayerEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new YoutubePlayerModule(this.modelBinders, this.viewModelBinders));
    
        injector.bind("youtubeEditor", YoutubeEditor);
        injector.bindSingleton("youtubeDropHandler", YoutubeHandlers);

        const dropHandlers:Array<IContentDropHandler> = injector.resolve("dropHandlers");
        dropHandlers.push(injector.resolve<YoutubeHandlers>("youtubeDropHandler"));

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<YoutubeHandlers>("youtubeDropHandler"));
    }
}