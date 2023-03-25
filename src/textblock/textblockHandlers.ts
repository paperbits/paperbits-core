import { TextblockModel } from "./textblockModel";
import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { openHelpArticleCommand, openWidgetEditorCommand, splitter, switchToParentCommand } from "@paperbits/common/ui/commands";

export class TextblockHandlers implements IWidgetHandler {
    constructor(private readonly viewManager: ViewManager) { }

    public async getWidgetModel(): Promise<TextblockModel> {
        return new TextblockModel([
            {
                type: "heading1",
                nodes: [{ type: "text", text: "Heading" }]
            },
            {
                type: "paragraph",
                nodes: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }]
            }
        ]);
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
            color: "#2b87da",
            selectCommands: [
                openWidgetEditorCommand(context, "Edit text"),
                splitter(),
                switchToParentCommand(context),
                // openHelpArticleCommand(context, "/widgets/text")
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