import { VideoPlayerModel } from "./videoPlayerModel";
import { VideoPlayerContract } from "./VideoPlayerContract";
import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IMediaService } from "@paperbits/common/media";

const DefaultSourceUrl = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v";

export class VideoPlayerModelBinder implements IModelBinder {
    private readonly permalinkService: IPermalinkService;
    private readonly mediaService: IMediaService;

    constructor(permalinkService: IPermalinkService, mediaService: IMediaService) {
        this.permalinkService = permalinkService;
        this.mediaService = mediaService;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "video-player";
    }

    public canHandleModel(model): boolean {
        return model instanceof VideoPlayerModel;
    }

    public async nodeToModel(videoPlayerNode: VideoPlayerContract): Promise<VideoPlayerModel> {
        let videoPlayerModel = new VideoPlayerModel();
        videoPlayerModel.controls = videoPlayerNode.controls;
        videoPlayerModel.autoplay = videoPlayerNode.autoplay;

        if (videoPlayerNode.sourceKey) {
            videoPlayerModel.sourceKey = videoPlayerNode.sourceKey;

            let permalink = await this.permalinkService.getPermalinkByKey(videoPlayerNode.sourceKey)

            if (!permalink) {
                console.warn(`Permalink with key ${videoPlayerNode.sourceKey} not found.`);
            }
            else {
                let media = await this.mediaService.getMediaByKey(permalink.targetKey);

                if (media) {
                    videoPlayerModel.sourceUrl = media.downloadUrl;
                }
                else {
                    // videoPlayerModel.sourceUrl = DefaultSourceUrl
                    console.warn(`Media file with key ${permalink.targetKey} not found, setting default image.`);
                }
            }
        }
        else if (videoPlayerNode.sourceUrl) {
            videoPlayerModel.sourceUrl = videoPlayerNode.sourceUrl;
        }
        else {
            videoPlayerModel.sourceUrl = null;//DefaultSourceUrl;
        }

        return videoPlayerModel;
    }

    public getConfig(videoPlayerModel: VideoPlayerModel): VideoPlayerContract {
        let videoConfig: VideoPlayerContract = {
            object: "block",
            type: "video-player",
            sourceKey: videoPlayerModel.sourceKey,
            controls: videoPlayerModel.controls,
            autoplay: videoPlayerModel.autoplay
        }

        return videoConfig;
    }
}