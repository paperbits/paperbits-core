import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder, WidgetState } from "@paperbits/common/widgets";
import { VideoPlayerModel } from "../videoPlayerModel";
import { VideoPlayer } from "./videoPlayer";

export class VideoPlayerViewModelBinder implements ViewModelBinder<VideoPlayerModel, VideoPlayer> {
    constructor(
        private readonly styleCompiler: StyleCompiler,
        private readonly mediaPermalinkResolver: IPermalinkResolver
    ) { }

    public stateToIntance(state: WidgetState, componentInstance: VideoPlayer): void {
        componentInstance.sourceUrl(state.sourceUrl);
        componentInstance.controls(state.controls);
        componentInstance.autoplay(state.autoplay);
        componentInstance.muted(state.muted);
        componentInstance.posterUrl(state.posterUrl);
        componentInstance.styles(state.styles);
    }

    public async modelToState(model: VideoPlayerModel, state: WidgetState): Promise<void> {
        state.controls = model.controls;
        state.autoplay = model.autoplay;
        state.muted = model.muted ? "muted" : undefined;

        if (model.sourceKey) {
            state.sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(model.sourceKey);

            if (!state.sourceUrl) {
                console.warn(`Unable to set video. Media with source key ${model.sourceKey} not found.`);
            }
        }

        if (model.posterSourceKey) {
            state.posterUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(model.posterSourceKey);
        }

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}