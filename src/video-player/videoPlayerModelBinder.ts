import { IModelBinder } from "@paperbits/common/editing";
import { VideoPlayerModel } from "./videoPlayerModel";
import { VideoPlayerContract } from "./videoPlayerContract";


export class VideoPlayerModelBinder implements IModelBinder<VideoPlayerModel> {
    public async contractToModel(contract: VideoPlayerContract): Promise<VideoPlayerModel> {
        const model = new VideoPlayerModel();
        model.controls = contract.controls;
        model.autoplay = contract.autoplay;
        model.muted = contract.muted;
        model.styles = contract.styles || { appearance: "components/videoPlayer/default" };
        model.sourceKey = contract.sourceKey;
        model.posterSourceKey = contract.posterSourceKey;

        return model;
    }

    public modelToContract(model: VideoPlayerModel): VideoPlayerContract {
        const videoConfig: VideoPlayerContract = {
            type: "video-player",
            sourceKey: model.sourceKey,
            controls: model.controls,
            autoplay: model.autoplay,
            muted: model.muted,
            posterSourceKey: model.posterSourceKey,
            styles: model.styles
        };

        return videoConfig;
    }
}