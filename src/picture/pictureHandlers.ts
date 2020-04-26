import * as Utils from "@paperbits/common/utils";
import { MediaContract } from "@paperbits/common/media";
import { IWidgetOrder, IContentDropHandler, IWidgetHandler, IDataTransfer, IContentDescriptor, IWidgetFactoryResult } from "@paperbits/common/editing";
import { PictureModel } from "./pictureModel";

const widgetDisplayName = "Picture";

export class PictureHandlers implements IWidgetHandler, IContentDropHandler {
    private static readonly imageFileExtensions = [".jpg", ".jpeg", ".png", ".svg", ".gif"];

    private async getWidgetOrderByConfig(sourceUrl: string, caption: string): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "picture",
            displayName: widgetDisplayName,
            category: "Media",
            iconClass: "paperbits-image-2",
            requires: ["html"],
            createModel: async () => {
                const pictureModel = new PictureModel();
                pictureModel.sourceKey = sourceUrl;
                pictureModel.caption = caption;

                return pictureModel;
            }
        };

        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig(null, widgetDisplayName);
    }

    public getContentDescriptorFromMedia(media: MediaContract): IContentDescriptor {
        if (!PictureHandlers.isMediaFile(media)) {
            return null;
        }

        return {
            title: widgetDisplayName,
            description: media.description,
            getWidgetOrder: async () => {
                return await this.getWidgetOrderByConfig(media.downloadUrl, media.fileName);
            }
        };
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        if (!dataTransfer.name || !PictureHandlers.imageFileExtensions.some(e => dataTransfer.name.endsWith(e))) {
            return null;
        }

        const source = dataTransfer.source;
        const droppedSourceUrl = URL.createObjectURL(source);

        const getThumbnailPromise = () => new Promise<string>(async (resolve) => {
            resolve(await Utils.readBlobAsDataUrl(<Blob>source));
        });

        return {
            title: widgetDisplayName,
            description: dataTransfer.name,
            getWidgetOrder: async () => {
                return await this.getWidgetOrderByConfig(droppedSourceUrl, dataTransfer.name);
            },
            getPreviewUrl: getThumbnailPromise,
            getThumbnailUrl: getThumbnailPromise,
            uploadables: [dataTransfer.source]
        };
    }

    public static isMediaFile(media: MediaContract): boolean {
        return (media.mimeType && media.mimeType.indexOf("image") !== -1) || (media.fileName && this.imageFileExtensions.some(e => media.fileName.endsWith(e)));
    }
}