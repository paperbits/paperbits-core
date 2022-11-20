import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder, WidgetState } from "@paperbits/common/widgets";
import { YoutubePlayerModel } from "../youtubePlayerModel";
import { YoutubePlayerViewModel } from "./youtubePlayer";

export class YoutubePlayerViewModelBinder implements ViewModelBinder<YoutubePlayerModel, YoutubePlayerViewModel> {
    constructor(private readonly styleCompiler: StyleCompiler) { }

    public stateToIntance(state: WidgetState, componentInstance: YoutubePlayerViewModel): void {
        componentInstance.sourceUrl(state.sourceUrl);
        componentInstance.styles(state.styles);
    }

    public async modelToState(model: YoutubePlayerModel, state: WidgetState): Promise<void> {
        const videoId = model.videoId;
        const autoplay = model.autoplay ? "1" : "0";
        const controls = model.controls ? "1" : "0";
        const loop = model.loop ? "1" : "0";

        const url = videoId
            ? `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&controls=${controls}&loop=${loop}`
            : null;

        state.sourceUrl = url;

        if (model.styles) {
            const styles = await this.styleCompiler.getStyleModelAsync(model.styles);
            state.styles = styles;
        }
    }
}