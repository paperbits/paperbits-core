import { IContentDropHandler, IContentDescriptor, IDataTransfer, IWidgetHandler } from "@paperbits/common/editing";
import { YoutubePlayerModel } from "./youtubePlayerModel";

export class YoutubeHandlers implements IWidgetHandler<YoutubePlayerModel>, IContentDropHandler {
    public async getWidgetModel(): Promise<YoutubePlayerModel> {
        return new YoutubePlayerModel();
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