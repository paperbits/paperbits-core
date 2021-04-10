import { IWidgetOrder, IContentDropHandler, IContentDescriptor, IDataTransfer, IWidgetHandler } from "@paperbits/common/editing";
import { YoutubePlayerModel } from "./youtubePlayerModel";

export class YoutubeHandlers implements IWidgetHandler, IContentDropHandler {
    private async getWidgetOrderByConfig(youtubeClipId?: string): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "youtube-player",
            displayName: "Youtube player",
            category: "Media",
            iconClass: "widget-icon widget-icon-youtube-player",
            requires: ["html", "js"],
            createModel: async () => {
                const youtubePlayerModel = new YoutubePlayerModel();
                youtubePlayerModel.videoId = youtubeClipId;
        
                return youtubePlayerModel;
            }
        };
        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return this.getWidgetOrderByConfig();
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        const videoId = this.getVideoId(dataTransfer);

        if (!videoId) {
            return undefined;
        }

        const getThumbnailPromise = () => Promise.resolve(`https://img.youtube.com/vi/${videoId}/0.jpg`);

        const descriptor: IContentDescriptor = {
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
                const videoId = new RegExp("[?&](?:v=)(.*?)(?:$|&)").exec(source);
                return videoId ? videoId[1] : undefined;
            }
        }

        return undefined;
    }
}