import { VideoPlayerModel } from "./videoPlayerModel";
import { VideoPlayerContract } from "./VideoPlayerContract";
import { IModelBinder } from "@paperbits/common/editing";
import { IMediaService } from "@paperbits/common/media";

export class VideoPlayerModelBinder implements IModelBinder {
    constructor(private readonly mediaService: IMediaService) { }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "video-player";
    }

    public canHandleModel(model): boolean {
        return model instanceof VideoPlayerModel;
    }

    public async contractToModel(videoPlayerNode: VideoPlayerContract): Promise<VideoPlayerModel> {
        const videoPlayerModel = new VideoPlayerModel();
        videoPlayerModel.controls = videoPlayerNode.controls;
        videoPlayerModel.autoplay = videoPlayerNode.autoplay;

        if (videoPlayerNode.sourceKey) {
            videoPlayerModel.sourceKey = videoPlayerNode.sourceKey;
            const media = await this.mediaService.getMediaByKey(videoPlayerNode.sourceKey);

            if (media) {
                videoPlayerModel.sourceUrl = media.downloadUrl;
            }
            else {
                // videoPlayerModel.sourceUrl = DefaultSourceUrl
                console.warn(`Media file with key ${videoPlayerNode.sourceKey} not found, setting default image.`);
            }

        }
        else if (videoPlayerNode.sourceUrl) {
            videoPlayerModel.sourceUrl = videoPlayerNode.sourceUrl;
        }
        else {
            videoPlayerModel.sourceUrl = null; // DefaultSourceUrl;
        }

        return videoPlayerModel;
    }

    public modelToContract(videoPlayerModel: VideoPlayerModel): VideoPlayerContract {
        const videoConfig: VideoPlayerContract = {
            object: "block",
            type: "video-player",
            sourceKey: videoPlayerModel.sourceKey,
            controls: videoPlayerModel.controls,
            autoplay: videoPlayerModel.autoplay
        };

        return videoConfig;
    }
}