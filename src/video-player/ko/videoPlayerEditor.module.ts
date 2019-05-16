import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { VideoEditor } from "./videoEditor";
import { VideoHandlers } from "./videoHandlers";

export class VideoPlayerEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("videoPlayerEditor", VideoEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", VideoHandlers, "videoHandler");
        injector.bindToCollection<IContentDropHandler>("dropHandlers", VideoHandlers, "videoHandler");
    }
}