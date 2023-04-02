import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet } from "@paperbits/common/ui";
import { deleteWidgetCommand, openHelpArticleCommand, openWidgetEditorCommand, splitter, switchToParentCommand } from "@paperbits/common/ui/commands";
import { DismissButtonModel } from "./dismissButtonModel";


export class DismissButtonHandlers implements IWidgetHandler {
    public async getWidgetModel(): Promise<DismissButtonModel> {
        return new DismissButtonModel();
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
            selectCommands: [
                openWidgetEditorCommand(context, "Edit button"),
                splitter(),
                switchToParentCommand(context),
                // openHelpArticleCommand(context, "/widgets/dismiss-button")
            ],
            deleteCommand: deleteWidgetCommand(context)
        };

        return contextualEditor;
    }
}