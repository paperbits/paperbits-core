import { VideoPlayer } from "./videoPlayer";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { VideoPlayerModel } from "../videoPlayerModel";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles/styleCompiler";
import { Bag } from "@paperbits/common";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { ComponentFlow } from "@paperbits/common/editing";

export class VideoPlayerViewModelBinder implements ViewModelBinder<VideoPlayerModel, VideoPlayer> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly mediaPermalinkResolver: IPermalinkResolver
    ) { }

    public async modelToViewModel(model: VideoPlayerModel, viewModel?: VideoPlayer, bindingContext?: Bag<any>): Promise<VideoPlayer> {
        if (!viewModel) {
            viewModel = new VideoPlayer();
        }

        let sourceUrl = null;

        if (model.sourceKey) {
            sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(model.sourceKey);

            if (!sourceUrl) {
                console.warn(`Unable to set video. Media with source key ${model.sourceKey} not found.`);
            }
        }

        viewModel.sourceUrl(sourceUrl);
        viewModel.controls(model.controls);
        viewModel.autoplay(model.autoplay);
        viewModel.muted(model.muted ? "muted" : undefined);

        if (model.posterSourceKey) {
            const posterUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(model.posterSourceKey);
            viewModel.posterUrl(posterUrl);
        }
        else {
            viewModel.posterUrl(null);
        }

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel["widgetBinding"] = {
            displayName: "Video player",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            flow: ComponentFlow.Inline,
            draggable: true,
            editor: "video-player-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: VideoPlayerModel): boolean {
        return model instanceof VideoPlayerModel;
    }
}