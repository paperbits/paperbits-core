import { YoutubePlayerContract } from "./youtubePlayerContract";
import { YoutubePlayerModel } from "./youtubePlayerModel";
import { IModelBinder } from "@paperbits/common/editing";

export class YoutubeModelBinder implements IModelBinder<YoutubePlayerModel> {
    public async contractToModel(contract: YoutubePlayerContract): Promise<YoutubePlayerModel> {
        const youtubePlayerModel = new YoutubePlayerModel();

        youtubePlayerModel.videoId = contract.videoId || contract["videoKey"];
        youtubePlayerModel.controls = contract.controls;
        youtubePlayerModel.autoplay = contract.autoplay;
        youtubePlayerModel.loop = contract.loop;
        youtubePlayerModel.styles = contract.styles || { appearance: "components/youtubePlayer/default" };

        return youtubePlayerModel;
    }

    public modelToContract(model: YoutubePlayerModel): YoutubePlayerContract {
        const youtubeConfig: YoutubePlayerContract = {
            type: "youtube-player",
            videoId: model.videoId,
            controls: model.controls,
            autoplay: model.autoplay,
            loop: model.loop,
            styles: model.styles
        };

        return youtubeConfig;
    }
}