import * as Utils from "@paperbits/common/utils";
import { MediaContract } from "@paperbits/common/media";
import { IWidgetOrder, IContentDropHandler, IWidgetHandler, IDataTransfer, IContentDescriptor, WidgetContext } from "@paperbits/common/editing";
import { PictureModel } from "./pictureModel";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";

const widgetDisplayName = "Picture";

export class PictureHandlers implements IWidgetHandler, IContentDropHandler {
    constructor(private readonly viewManager: ViewManager) { }
    
    private static readonly imageFileExtensions = [".jpg", ".jpeg", ".png", ".svg", ".gif"];

    private async getWidgetOrderByConfig(sourceUrl: string, caption: string): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "picture",
            displayName: widgetDisplayName,
            category: "Media",
            iconClass: "widget-icon widget-icon-picture",
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
        const droppedSourceUrl = URL.createObjectURL(<Blob>source);

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

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
            color: "#2b87da",
            selectCommands: [
                {
                    controlType: "toolbox-button",
                    displayName: "Edit picture",
                    callback: () => this.viewManager.openWidgetEditor(context.binding)
                },
                {
                    controlType: "toolbox-splitter"
                },
                {
                    controlType: "toolbox-button",
                    tooltip: "Switch to parent",
                    iconClass: "paperbits-icon paperbits-enlarge-vertical",
                    callback: () => context.gridItem.getParent().select(),
                }
                // {
                //     tooltip: "Help",
                //     iconClass: "paperbits-icon paperbits-c-question",
                //     position: "top right",
                //     color: "#607d8b",
                //     callback: () => {
                //         // 
                //     }
                // }
            ],
            deleteCommand: {
                controlType: "toolbox-button",
                tooltip: "Delete widget",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                }
            }
        };

        return contextualEditor;
    }
}