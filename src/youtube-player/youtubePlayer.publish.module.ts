import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { YoutubeModelBinder } from "./youtubeModelBinder";
import { YoutubePlayerViewModel } from "./ko/youtubePlayer";
import { YoutubePlayerViewModelBinder } from "./ko/youtubePlayerViewModelBinder";
import { YoutubePlayerModel } from "./youtubePlayerModel";
import { KnockoutComponentBinder } from "../ko";
import { YoutubeHandlers } from "./youtubeHandlers";
import { IWidgetService } from "@paperbits/common/widgets";

export class YoutubePlayerPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("youtubePlayer", YoutubePlayerViewModel);
        injector.bindSingleton("youtubePlayerModelBinder", YoutubeModelBinder);
        injector.bindSingleton("youtubePlayerViewModelBinder", YoutubePlayerViewModelBinder)
        injector.bindSingleton("youtubePlayerHandler", YoutubeHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("youtube-player", {
            modelDefinition: YoutubePlayerModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: YoutubePlayerViewModel,
            modelBinder: YoutubeModelBinder,
            viewModelBinder: YoutubePlayerViewModelBinder
        });
    }
}