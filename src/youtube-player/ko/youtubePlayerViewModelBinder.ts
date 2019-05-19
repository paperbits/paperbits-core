import { YoutubePlayerViewModel } from "./youtubePlayerViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets/IViewModelBinder";
import { YoutubePlayerModel } from "../youtubePlayerModel";
import { IEventManager } from "@paperbits/common/events";

export class YoutubePlayerViewModelBinder implements ViewModelBinder<YoutubePlayerModel, YoutubePlayerViewModel> {
    constructor(private readonly eventManager: IEventManager) { }

    public async modelToViewModel(model: YoutubePlayerModel, viewModel?: YoutubePlayerViewModel): Promise<YoutubePlayerViewModel> {
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
            model: model,
            editor: "youtube-editor",
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: YoutubePlayerModel): boolean {
        return model instanceof YoutubePlayerModel;
    }
}