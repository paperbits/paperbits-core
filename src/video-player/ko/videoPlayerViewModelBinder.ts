import { VideoPlayerViewModel } from "./videoPlayerViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { VideoPlayerModel } from "../videoPlayerModel";
import { IEventManager } from "@paperbits/common/events";

export class VideoPlayerViewModelBinder implements ViewModelBinder<VideoPlayerModel, VideoPlayerViewModel> {
    constructor(private readonly eventManager: IEventManager) { }

    public async modelToViewModel(model: VideoPlayerModel, viewModel?: VideoPlayerViewModel): Promise<VideoPlayerViewModel> {
        if (!viewModel) {
            viewModel = new VideoPlayerViewModel();
        }

        viewModel.sourceUrl(model.sourceUrl);
        viewModel.controls(model.controls);
        viewModel.autoplay(model.autoplay);

        viewModel["widgetBinding"] = {
            displayName: "Video player",
            model: model,
            editor: "video-player-editor",
            applyChanges: () => {
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