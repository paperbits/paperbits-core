import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { deleteWidgetCommand, openHelpArticleCommand, openWidgetEditorCommand, splitter, switchToParentCommand } from "@paperbits/common/ui/commands";
import { ButtonModel } from "./buttonModel";
import { IVisibilityCommandProvider } from "../security/visibilityContextCommandProvider";


export class ButtonHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly visibilityCommandProvider: IVisibilityCommandProvider,
    ) {
    }

    public async getWidgetModel(): Promise<ButtonModel> {
        return new ButtonModel();
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
            selectCommands: [
                openWidgetEditorCommand(context, "Edit button"),
                splitter(),
                switchToParentCommand(context),
                this.visibilityCommandProvider.create(context),
                // openHelpArticleCommand(context, "/widgets/button")
            ],
            deleteCommand: deleteWidgetCommand(context)
        };

        return contextualEditor;
    }
}