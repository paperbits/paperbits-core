import * as Utils from "@paperbits/common/utils";
import { MediaContract } from "@paperbits/common/media";
import { IContentDropHandler, IWidgetHandler, IDataTransfer, IContentDescriptor, WidgetContext } from "@paperbits/common/editing";
import { PictureModel } from "./pictureModel";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";

const widgetDisplayName = "Picture";

export class PictureHandlers implements IWidgetHandler, IContentDropHandler {
    constructor(private readonly viewManager: ViewManager) { }

    public async getWidgetModel(): Promise<PictureModel> {
        return new PictureModel();
    }

    private static readonly imageFileExtensions = [".jpg", ".jpeg", ".png", ".svg", ".gif"];

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        if (typeof dataTransfer.source !== "string" && !dataTransfer.mimeType?.startsWith("image/")) {
            return;
        }

        const source = dataTransfer.source;

        const getThumbnailPromise = async () => {
            if (typeof source === "string") {
                return <string>source;
            }

            return await Utils.readBlobAsDataUrl(<Blob>source);
        };

        return {
            title: widgetDisplayName,
            description: dataTransfer.name,
            getPreviewUrl: getThumbnailPromise,
            getThumbnailUrl: getThumbnailPromise,
            uploadables: [dataTransfer.source]
        };
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