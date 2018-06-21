import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { YoutubeEditor } from "./youtubeEditor";
import { YoutubeHandlers } from "../youtubeHandlers";

export class YoutubePlayerEditorModule implements IInjectorModule {
    register(injector: IInjector): void {      
    
        injector.bind("youtubeEditor", YoutubeEditor);
        injector.bindSingleton("youtubeDropHandler", YoutubeHandlers);

        const dropHandlers:Array<IContentDropHandler> = injector.resolve("dropHandlers");
        dropHandlers.push(injector.resolve<YoutubeHandlers>("youtubeDropHandler"));

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<YoutubeHandlers>("youtubeDropHandler"));
    }
}