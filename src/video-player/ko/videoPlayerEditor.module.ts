import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { VideoEditor } from "./videoEditor";
import { VideoHandlers } from "./videoHandlers";

export class VideoPlayerEditorModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("videoPlayerEditor", VideoEditor);
        injector.bindSingleton("videoDropHandler", VideoHandlers);

        const dropHandlers:Array<IContentDropHandler> = injector.resolve("dropHandlers");
        dropHandlers.push(injector.resolve<VideoHandlers>("videoDropHandler"));

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<VideoHandlers>("videoDropHandler"));
    }
}