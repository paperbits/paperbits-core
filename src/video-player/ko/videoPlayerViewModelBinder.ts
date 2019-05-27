import { VideoPlayerViewModel } from "./videoPlayerViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { VideoPlayerModel } from "../videoPlayerModel";
import { IEventManager } from "@paperbits/common/events";
import { IStyleCompiler } from "@paperbits/common/styles/IStyleCompiler";

export class VideoPlayerViewModelBinder implements ViewModelBinder<VideoPlayerModel, VideoPlayerViewModel> {
    constructor(
        private readonly eventManager: IEventManager,
        private readonly styleCompiler: IStyleCompiler
    ) { }

    public async modelToViewModel(model: VideoPlayerModel, viewModel?: VideoPlayerViewModel): Promise<VideoPlayerViewModel> {
        if (!viewModel) {
            viewModel = new VideoPlayerViewModel();
        }

        viewModel.sourceUrl(model.sourceUrl);
        viewModel.controls(model.controls);
        viewModel.autoplay(model.autoplay);
        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getClassNamesByStyleConfigAsync2(model.styles));
        }

        viewModel["widgetBinding"] = {
            displayName: "Video player",
            model: model,
            editor: "video-player-editor",
            applyChanges: (changes) => {
                Object.assign(model, changes);
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: VideoPlayerModel): boolean {
        return model instanceof VideoPlayerModel;
    }
}