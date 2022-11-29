import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { VideoPlayerModel, VideoPlayerModelBinder } from ".";
import { KnockoutComponentBinder } from "../ko";
import { VideoPlayer, VideoPlayerViewModelBinder } from "./ko";

export class VideoPlayerModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("videoPlayer", VideoPlayer);
        injector.bindSingleton("videoPlayerModelBinder", VideoPlayerModelBinder);
        injector.bindSingleton("videoPlayerViewModelBinder", VideoPlayerViewModelBinder)

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("video-player", {
            modelDefinition: VideoPlayerModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: VideoPlayer,
            modelBinder: VideoPlayerModelBinder,
            viewModelBinder: VideoPlayerViewModelBinder
        });
    }
}