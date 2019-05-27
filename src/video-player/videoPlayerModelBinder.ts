import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { IModelBinder } from "@paperbits/common/editing";
import { VideoPlayerModel } from "./videoPlayerModel";
import { VideoPlayerContract } from "./videoPlayerContract";
import { Contract } from "@paperbits/common";


export class VideoPlayerModelBinder implements IModelBinder {
    constructor(private readonly mediaPermalinkResolver: IPermalinkResolver) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "video-player";
    }

    public canHandleModel(model): boolean {
        return model instanceof VideoPlayerModel;
    }

    public async contractToModel(contract: VideoPlayerContract): Promise<VideoPlayerModel> {
        const model = new VideoPlayerModel();
        model.controls = contract.controls;
        model.autoplay = contract.autoplay;
        model.styles = contract.styles || { appearance: "components/videoPlayer/default" };

        if (contract.sourceKey) {
            model.sourceKey = contract.sourceKey;
            model.sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(contract.sourceKey);

            if (!model.sourceUrl) {
                console.warn(`Unable to set video. Media file with key ${contract.sourceKey} not found.`);
            }
        }
        else if (contract.sourceUrl) {
            model.sourceUrl = contract.sourceUrl;
        }
        else {
            model.sourceUrl = null; // DefaultSourceUrl;
        }

        return model;
    }

    public modelToContract(videoPlayerModel: VideoPlayerModel): VideoPlayerContract {
        const videoConfig: VideoPlayerContract = {
            type: "video-player",
            sourceKey: videoPlayerModel.sourceKey,
            controls: videoPlayerModel.controls,
            autoplay: videoPlayerModel.autoplay,
            styles: videoPlayerModel.styles
        };

        return videoConfig;
    }
}