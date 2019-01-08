import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { YoutubeEditor } from "./youtubeEditor";
import { YoutubeHandlers } from "../youtubeHandlers";

export class YoutubePlayerEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("youtubeEditor", YoutubeEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", YoutubeHandlers, "youtubeHandler");
        injector.bindToCollection<IContentDropHandler>("dropHandlers", YoutubeHandlers, "youtubeHandler");
    }
}