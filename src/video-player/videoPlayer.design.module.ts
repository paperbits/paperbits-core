import template from "./ko/styleGuideCard.html";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { VideoPlayer, VideoPlayerViewModelBinder } from "./ko";
import { VideoPlayerEditor } from "./ko/videoPlayerEditor";
import { VideoPlayerHandlers } from "./videoPlayerHandlers";
import { VideoPlayerModel } from "./videoPlayerModel";
import { VideoPlayerModelBinder } from "./videoPlayerModelBinder";


export class VideoPlayerDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("videoPlayer", VideoPlayer);
        injector.bind("videoPlayerEditor", VideoPlayerEditor);
        injector.bindSingleton("videoPlayerModelBinder", VideoPlayerModelBinder);
        injector.bindSingleton("videoPlayerViewModelBinder", VideoPlayerViewModelBinder)
        injector.bindSingleton("videoPlayerHandler", VideoPlayerHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("video-player", {
            modelDefinition: VideoPlayerModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: VideoPlayer,
            modelBinder: VideoPlayerModelBinder,
            viewModelBinder: VideoPlayerViewModelBinder
        });

        widgetService.registerWidgetEditor("video-player", {
            displayName: "Video player",
            iconClass: "widget-icon widget-icon-video-player",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: VideoPlayerEditor,
            handlerComponent: VideoPlayerHandlers
        });

        const styleGroup: IStyleGroup = {
            key: "videoPlayer",
            name: "components_videoPlayer",
            groupName: "Video Player",
            selectorTemplate: undefined,
            styleTemplate: template
        };

        injector.bindInstanceToCollection("styleGroups", styleGroup);
    }
}