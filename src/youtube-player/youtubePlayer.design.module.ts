import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { YoutubePlayerEditor } from "./ko/youtubePlayerEditor";
import { YoutubeHandlers } from "./youtubeHandlers";
import { YoutubePlayerModel } from "./youtubePlayerModel";
import { KnockoutComponentBinder } from "../ko";
import { YoutubeModelBinder } from "./youtubeModelBinder";
import { YoutubePlayerViewModel, YoutubePlayerViewModelBinder } from "./ko";
import { IWidgetService } from "@paperbits/common/widgets";

export class YoutubePlayerDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("youtubePlayer", YoutubePlayerViewModel);
        injector.bind("youtubePlayerEditor", YoutubePlayerEditor);
        injector.bindSingleton("youtubePlayerModelBinder", YoutubeModelBinder);
        injector.bindSingleton("youtubePlayerViewModelBinder", YoutubePlayerViewModelBinder)
        injector.bindSingleton("youtubePlayerHandler", YoutubeHandlers);

        // TODO: Create respective handler property in WidgetEditorDefinition
        injector.bindToCollectionAsSingletone("dropHandlers", YoutubeHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("youtube-player", {
            modelDefinition: YoutubePlayerModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: YoutubePlayerViewModel,
            modelBinder: YoutubeModelBinder,
            viewModelBinder: YoutubePlayerViewModelBinder
        });

        widgetService.registerWidgetEditor("youtube-player", {
            displayName: "Youtube player",
            iconClass: "widget-icon widget-icon-youtube-player",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: YoutubePlayerEditor,
            handlerComponent: YoutubeHandlers
        });
    }
}