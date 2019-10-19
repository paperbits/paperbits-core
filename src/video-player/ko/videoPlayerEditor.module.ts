import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { VideoEditor } from "./videoEditor";
import { VideoHandlers } from "./videoHandlers";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";

export class VideoPlayerEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("videoPlayerEditor", VideoEditor);
        const styleGroup: IStyleGroup = { 
            key: "videoPlayer",
            name: "components_videoPlayer", 
            groupName: "Video Player", 
            selectorTemplate: undefined,
            styleTemplate: `<video class="no-pointer-events" data-bind="stylePreview:variant" style="width: 340px"><source src="https://cdn.paperbits.io/videos/planet-earth.mp4" /></video>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", VideoHandlers, "videoHandler");
        injector.bindToCollection<IContentDropHandler>("dropHandlers", VideoHandlers, "videoHandler");
    }
}