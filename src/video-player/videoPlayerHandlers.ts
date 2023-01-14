import * as MediaUtils from "@paperbits/common/media/mediaUtils";
import { IContentDropHandler, IContentDescriptor, IDataTransfer, IWidgetHandler } from "@paperbits/common/editing";
import { VideoPlayerModel } from "./videoPlayerModel";

export class VideoPlayerHandlers implements IWidgetHandler, IContentDropHandler {
    public static DefaultThumbnailUri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZyAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC41LCAwLjUpIj4KPHJlY3QgeD0iMiIgeT0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDQ0NDQ0IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQwIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+Cjxwb2x5Z29uIGRhdGEtY29sb3I9ImNvbG9yLTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iJiMxMDsmIzk7MTcsMTQgMzMsMjQgMTcsMzQgIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+CjwvZz48L3N2Zz4=";

    public async getWidgetModel(): Promise<VideoPlayerModel> {
        return new VideoPlayerModel();
    }

    protected matches(filename: string): boolean {
        if (filename && ![".webm", ".mp4", ".m4v", ".ogg", ".ogv", ".ogx", ".ogm"].some(e => filename.endsWith(e))) {
            return false;
        }
        return true;
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        if (!this.matches(dataTransfer.name)) {
            return null;
        }

        const source: any = dataTransfer.source;

        const getThumbnailPromise = async (): Promise<string> => {
            if (dataTransfer.source instanceof File || dataTransfer.source.constructor["name"] === "File") {
                return await MediaUtils.getVideoThumbnailAsDataUrl(<any>source);
            }
            return <string>dataTransfer.source;
        };

        const descriptor: IContentDescriptor = {
            title: "Video recording",
            description: dataTransfer.name,
            iconUrl: VideoPlayerHandlers.DefaultThumbnailUri,
            getPreviewUrl: getThumbnailPromise,
            getThumbnailUrl: getThumbnailPromise,
            uploadables: [source]
        };

        return descriptor;
    }
}