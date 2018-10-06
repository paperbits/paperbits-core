import * as ko from "knockout";
import * as MediaUtils from "@paperbits/common/media/mediaUtils";
import { ICreatedMedia } from "@paperbits/common/media";
import { IWidgetFactoryResult } from "@paperbits/common/editing";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetOrder } from "@paperbits/common/editing";
import { IWidgetHandler } from "@paperbits/common/editing";
import { IContentDropHandler } from "@paperbits/common/editing";
import { IContentDescriptor } from "@paperbits/common/editing";
import { IDataTransfer } from "@paperbits/common/editing";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { VideoPlayerModelBinder } from "../videoPlayerModelBinder";
import { VideoPlayerViewModelBinder } from "./videoPlayerViewModelBinder";
import { VideoPlayerContract } from "../videoPlayerContract";
import { VideoPlayerModel } from "../videoPlayerModel";

export class VideoHandlers implements IWidgetHandler, IContentDropHandler {
    public static DefaultThumbnailUri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZyAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC41LCAwLjUpIj4KPHJlY3QgeD0iMiIgeT0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDQ0NDQ0IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQwIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+Cjxwb2x5Z29uIGRhdGEtY29sb3I9ImNvbG9yLTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NDQ0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iJiMxMDsmIzk7MTcsMTQgMzMsMjQgMTcsMzQgIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+CjwvZz48L3N2Zz4=";

    constructor(
        private readonly permalinkService: IPermalinkService,
        private readonly videoPlayerModelBinder: VideoPlayerModelBinder,
        private readonly videoPlayerViewModelBinder: VideoPlayerViewModelBinder,
    ) { }

    protected matches(filename: string): boolean {
        if (filename && ![".webm", ".mp4", ".m4v", ".ogg", ".ogv", ".ogx", ".ogm"].some(e => filename.endsWith(e))) {
            return false;
        }
        return true;
    }


    private async getWidgetOrderFromSourceUrlOrFile(source: string | File): Promise<IWidgetOrder> {
        let sourceUrl: string; // normal URL or data URL

        if (!source) {
            sourceUrl = null; //VideoHandlers.DefaultThumbnailUri;
        }
        else if (source instanceof File || source.constructor["name"] === "File") {
            sourceUrl = await MediaUtils.getVideoThumbnailAsDataUrl(<any>source);
        }
        else {
            sourceUrl = source;
        }

        const widgetOrder: IWidgetOrder = {
            name: "video-player",
            displayName: "Video player",
            iconClass: "paperbits-action-74",
            requires: ["scripts"],
            createModel: async () => {

                const config: VideoPlayerContract = {
                    object: "block",
                    type: "video-player",
                    sourceUrl: sourceUrl,
                    controls: true,
                    autoplay: false
                }

                return await this.videoPlayerModelBinder.contractToModel(config);
            },
            createWidget: (): IWidgetFactoryResult => {
                // We create HTML element here just for dragging animation
                const videoPlayerModel = new VideoPlayerModel();
                videoPlayerModel.sourceUrl = sourceUrl;

                const videoPlayerViewModel = this.videoPlayerViewModelBinder.modelToViewModel(videoPlayerModel);
                const htmlElement = document.createElement("widget");

                htmlElement.style.width = "150px";
                htmlElement.style.height = "150px";
                htmlElement.style.overflow = "hidden";
                htmlElement.style.backgroundSize = "cover";
                htmlElement.classList.add("no-pointer-events");

                ko.applyBindingsToNode(htmlElement, { widget: videoPlayerViewModel });

                return {
                    element: htmlElement,
                    widgetModel: videoPlayerModel,
                    widgetBinding: videoPlayerViewModel["widgetBinding"],
                    onMediaUploadedCallback: (media: ICreatedMedia) => {
                        videoPlayerModel.sourceUrl = media.media.downloadUrl;
                        videoPlayerModel.sourceKey = media.permalink.key;

                        /*
                            At this moment the viewmodel declared above doesn't exist anymore,
                            after dropping widget into column, it will be redrawn and new viewmodel created.
                        */
                    }
                }
            },
        }

        return widgetOrder;
    }

    private async getWidgetOrderByConfig(sourceUrl: string): Promise<IWidgetOrder> {
        return await this.getWidgetOrderFromSourceUrlOrFile(sourceUrl);
    }

    private async getWidgetOrderByUrl(url: string): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig(url);
    }

    public getContentDescriptorFromMedia(media: MediaContract): IContentDescriptor {
        if (!this.matches(media.filename)) {
            return null;
        }

        const getWidgetOrderFunction: () => Promise<IWidgetOrder> = async () => {
            const config: VideoPlayerContract = {
                object: "block",
                type: "video-player",
                sourceKey: media.permalinkKey,
                controls: true,
                autoplay: false
            }

            const permalink = await this.permalinkService.getPermalinkByKey(media.permalinkKey)

            return await this.getWidgetOrderFromSourceUrlOrFile(permalink.uri);
        }

        return {
            title: "Video recording",
            iconUrl: VideoHandlers.DefaultThumbnailUri,
            description: media.description,
            getWidgetOrder: getWidgetOrderFunction
        };
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        if (!this.matches(dataTransfer.name)) {
            return null;
        }

        const source: any = dataTransfer.source;

        const getThumbnailPromise = async () => {
            if (dataTransfer.source instanceof File || dataTransfer.source.constructor["name"] === "File") {
                return await MediaUtils.getVideoThumbnailAsDataUrl(<any>source);
            }
            return dataTransfer.source;
        };

        const descriptor: IContentDescriptor = {
            title: "Video recording",
            description: dataTransfer.name,
            getWidgetOrder: async () => {
                return await this.getWidgetOrderByUrl(source);
            },
            iconUrl: VideoHandlers.DefaultThumbnailUri,
            getPreviewUrl: getThumbnailPromise,
            getThumbnailUrl: getThumbnailPromise,
            uploadables: [source]
        };

        return descriptor;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig(null);
    }
}