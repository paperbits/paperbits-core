import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { YoutubePlayerViewModel } from "./youtubePlayer";
import { YoutubePlayerModel } from "../youtubePlayerModel";
import { EventManager, Events } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";
import { StyleCompiler } from "@paperbits/common/styles";

export class YoutubePlayerViewModelBinder implements ViewModelBinder<YoutubePlayerModel, YoutubePlayerViewModel> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: YoutubePlayerModel, viewModel?: YoutubePlayerViewModel, bindingContext?: Bag<any>): Promise<YoutubePlayerViewModel> {
        if (!viewModel) {
            viewModel = new YoutubePlayerViewModel();
        }

        const videoId = model.videoId;
        const autoplay = model.autoplay ? "1" : "0";
        const controls = model.controls ? "1" : "0";
        const loop = model.loop ? "1" : "0";

        const url = videoId
            ? `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&controls=${controls}&loop=${loop}`
            : null;

        viewModel.sourceUrl(url);
        
        if (model.styles) {
            const st = await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager);
            viewModel.styles(st);
        }

        const biding: IWidgetBinding<YoutubePlayerModel, YoutubePlayerViewModel> = {
            name: "youtube-player",
            displayName: "Youtube player",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            flow: ComponentFlow.Inline,
            draggable: true,
            editor: "youtube-player-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = biding;

        return viewModel;
    }

    public canHandleModel(model: YoutubePlayerModel): boolean {
        return model instanceof YoutubePlayerModel;
    }
}