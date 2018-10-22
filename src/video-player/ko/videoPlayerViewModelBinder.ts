import { VideoPlayerViewModel } from "./videoPlayerViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { VideoPlayerModel } from "../videoPlayerModel";
import { IEventManager } from "@paperbits/common/events";

export class VideoPlayerViewModelBinder implements IViewModelBinder<VideoPlayerModel, VideoPlayerViewModel> {
    constructor(private readonly eventManager: IEventManager) { }

    public modelToViewModel(model: VideoPlayerModel, viewModel?: VideoPlayerViewModel): VideoPlayerViewModel {
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