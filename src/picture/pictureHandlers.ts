import * as Utils from "@paperbits/common/utils";
import { IContentDropHandler, IWidgetHandler, IDataTransfer, IContentDescriptor, WidgetContext } from "@paperbits/common/editing";
import { PictureModel } from "./pictureModel";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { deleteWidgetCommand, openHelpArticleCommand, openWidgetEditorCommand, splitter, switchToParentCommand } from "@paperbits/common/ui/commands";

const widgetDisplayName = "Picture";

export class PictureHandlers implements IWidgetHandler<PictureModel>,  IContentDropHandler {
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
                openWidgetEditorCommand(context, "Edit picture"),
                splitter(),
                switchToParentCommand(context),
                // openHelpArticleCommand(context, "/widgets/picture")
            ],
            deleteCommand: deleteWidgetCommand(context)
        };

        return contextualEditor;
    }
}