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
        let youtubePlayerModel = new YoutubePlayerModel();

        youtubePlayerModel.videoId = youtubeNode.videoId;

        return youtubePlayerModel;
    }

    public modelToContract(youtubeModel: YoutubePlayerModel): YoutubePlayerContract {
        let youtubeConfig: YoutubePlayerContract = {
            object: "block",
            type: "youtube-player",
            videoId: youtubeModel.videoId
        }

        return youtubeConfig;
    }
}