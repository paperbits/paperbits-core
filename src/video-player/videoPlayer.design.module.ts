import template from "./ko/styleGuideCard.html";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { VideoEditor } from "./ko/videoEditor";
import { VideoHandlers } from "./ko/videoHandlers";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";

export class VideoPlayerDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("videoPlayerEditor", VideoEditor);
        
        const styleGroup: IStyleGroup = { 
            key: "videoPlayer",
            name: "components_videoPlayer", 
            groupName: "Video Player", 
            selectorTemplate: undefined,
            styleTemplate: template
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", VideoHandlers, "videoHandler");
        injector.bindToCollection<IContentDropHandler>("dropHandlers", VideoHandlers, "videoHandler");
    }
}