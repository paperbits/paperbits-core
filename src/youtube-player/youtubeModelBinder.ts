import { YoutubePlayerContract } from "./youtubePlayerContract";
import { YoutubePlayerModel } from "./youtubePlayerModel";
import { IModelBinder } from "@paperbits/common/editing";

export class YoutubeModelBinder implements IModelBinder {
    constructor() {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "youtube-player";
    }

    public canHandleModel(model): boolean {
        return model instanceof YoutubePlayerModel;
    }

    public async contractToModel(youtubeNode: YoutubePlayerContract): Promise<YoutubePlayerModel> {
        const youtubePlayerModel = new YoutubePlayerModel();

        youtubePlayerModel.videoId = youtubeNode.videoId;
        youtubePlayerModel.origin = youtubeNode.origin;
        youtubePlayerModel.controls = youtubeNode.controls;
        youtubePlayerModel.autoplay = youtubeNode.autoplay;
        youtubePlayerModel.loop = youtubeNode.loop;

        return youtubePlayerModel;
    }

    public modelToContract(youtubeModel: YoutubePlayerModel): YoutubePlayerContract {
        const youtubeConfig: YoutubePlayerContract = {
            object: "block",
            type: "youtube-player",
            videoId: youtubeModel.videoId,
            origin: youtubeModel.origin,
            controls: youtubeModel.controls,
            autoplay: youtubeModel.autoplay,
            loop: youtubeModel.loop
        };

        return youtubeConfig;
    }
}