import { YoutubePlayerViewModel } from "./youtubePlayerViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { YoutubePlayerModel } from "../youtubePlayerModel";

export class YoutubePlayerViewModelBinder implements IViewModelBinder<YoutubePlayerModel, YoutubePlayerViewModel> {
    public modelToViewModel(model: YoutubePlayerModel, readonly: boolean, viewModel?: YoutubePlayerViewModel): YoutubePlayerViewModel {
        if (!viewModel) {
            viewModel = new YoutubePlayerViewModel();
        }

        viewModel.videoId(model.videoId);
        viewModel.origin(model.origin);
        viewModel.controls(model.controls);
        viewModel.autoplay(model.autoplay);
        viewModel.loop(model.loop);

        viewModel["widgetBinding"] = {
            displayName: "Youtube player",
            readonly: readonly,
            model: model,
            editor: "youtube-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: YoutubePlayerModel): boolean {
        return model instanceof YoutubePlayerModel;
    }
}