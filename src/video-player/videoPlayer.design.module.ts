import template from "./ko/styleGuideCard.html";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { VideoPlayerEditor } from "./ko/videoPlayerEditor";
import { VideoPlayerHandlers } from "./videoPlayerHandlers";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";

export class VideoPlayerDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("videoPlayerEditor", VideoPlayerEditor);
        
        const styleGroup: IStyleGroup = { 
            key: "videoPlayer",
            name: "components_videoPlayer", 
            groupName: "Video Player", 
            selectorTemplate: undefined,
            styleTemplate: template
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", VideoPlayerHandlers, "videoHandler");
        injector.bindToCollection<IContentDropHandler>("dropHandlers", VideoPlayerHandlers, "videoHandler");
    }
}