import { IWidgetOrder } from '@paperbits/common/editing';
import { IContentDropHandler } from '@paperbits/common/editing';
import { IDataTransfer } from '@paperbits/common/editing';
import { IContentDescriptor } from '@paperbits/common/editing';
import { IWidgetHandler } from '@paperbits/common/editing';
import { YoutubeModelBinder } from './youtubeModelBinder';
import { YoutubePlayerModel } from './youtubePlayerModel';

const defaultYoutubeClipId = "KK9bwTlAvgo";

export class YoutubeHandlers implements IWidgetHandler, IContentDropHandler {
    private readonly youtubePlayerModelBinder: YoutubeModelBinder;

    constructor(youtubeModelBinder: YoutubeModelBinder) {
        this.youtubePlayerModelBinder = youtubeModelBinder;
    }

    private async getWidgetOrderByConfig(youtubeClipId: string): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "youtube-player",
            displayName: "Youtube player",
            iconClass: "paperbits-player-48",
            requires: ["scripts"],
            createModel: async () => {
                const youtubePlayerModel = new YoutubePlayerModel();
                youtubePlayerModel.videoId = youtubeClipId;
        
                return youtubePlayerModel;
            }
        }
        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig(defaultYoutubeClipId);
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        let videoId = this.getVideoId(dataTransfer);

        if (!videoId) {
            return null;
        }

        let getThumbnailPromise = () => Promise.resolve(`https://img.youtube.com/vi/${videoId}/0.jpg`);

        let descriptor: IContentDescriptor = {
            title: "Youtube player",
            description: "",
            getWidgetOrder: (): Promise<IWidgetOrder> => this.getWidgetOrderByConfig(videoId),
            getPreviewUrl: getThumbnailPromise,
            getThumbnailUrl: getThumbnailPromise
        };

        return descriptor;
    }

    private getVideoId(dataTransfer: IDataTransfer): string {
        const source = dataTransfer.source;

        if (source && typeof source === "string") {
            const lower = source.toLowerCase();

            if (lower.startsWith("https://www.youtube.com") || lower.startsWith("http://www.youtube.com")) {
                let videoId = new RegExp("[?&](?:v=)(.*?)(?:$|&)").exec(source);
                return videoId ? videoId[1] : null;
            }
        }

        return null;
    }
}