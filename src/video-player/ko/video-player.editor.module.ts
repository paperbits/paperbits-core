import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { VideoEditor } from "./videoEditor";
import { VideoHandlers } from "./videoHandlers";
import { VideoPlayerModule } from "./video-player.module";

export class VideoPlayerEditorModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {        
        injector.bindModule(new VideoPlayerModule(this.modelBinders, this.viewModelBinders));
    
        injector.bind("videoPlayerEditor", VideoEditor);
        injector.bindSingleton("videoDropHandler", VideoHandlers);

        const dropHandlers:Array<IContentDropHandler> = injector.resolve("dropHandlers");
        dropHandlers.push(injector.resolve<VideoHandlers>("videoDropHandler"));

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<VideoHandlers>("videoDropHandler"));
    }
}