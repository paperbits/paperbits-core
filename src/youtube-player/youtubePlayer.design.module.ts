import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { YoutubePlayerEditor } from "./ko/youtubePlayerEditor";
import { YoutubeHandlers } from "./youtubeHandlers";

export class YoutubePlayerDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("youtubeEditor", YoutubePlayerEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", YoutubeHandlers, "youtubeHandler");
        injector.bindToCollection<IContentDropHandler>("dropHandlers", YoutubeHandlers, "youtubeHandler");
    }
}