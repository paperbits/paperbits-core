import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet } from "@paperbits/common/ui";
import { deleteWidgetCommand, openWidgetEditorCommand, splitter, switchToParentCommand } from "@paperbits/common/ui/commands";
import { ButtonModel } from "./buttonModel";
import { IVisibilityContextCommandProvider } from "../security/visibilityContextCommandProvider";


export class ButtonHandlers implements IWidgetHandler<ButtonModel> {
    constructor(private readonly visibilityCommandProvider: IVisibilityContextCommandProvider) { }

    public async getWidgetModel(): Promise<ButtonModel> {
        return new ButtonModel();
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const visibilityCommand = this.visibilityCommandProvider.create(context);

        const selectCommands = [
            openWidgetEditorCommand(context, "Edit button"),
            splitter(),
            switchToParentCommand(context),
            // openHelpArticleCommand(context, "/widgets/button")
        ];

        if (visibilityCommand) {
            selectCommands.push(visibilityCommand);
        }

        const contextualEditor: IContextCommandSet = {
            selectCommands: selectCommands,
            deleteCommand: deleteWidgetCommand(context)
        };

        return contextualEditor;
    }
}