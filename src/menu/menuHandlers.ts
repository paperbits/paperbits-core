import { IWidgetHandler, IWidgetOrder, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet } from "@paperbits/common/ui";
import { deleteWidgetCommand, openWidgetEditorCommand, splitter, switchToParentCommand } from "@paperbits/common/ui/commands";
import { MenuModel } from "./menuModel";
import { IVisibilityContextCommandProvider } from "../security/visibilityContextCommandProvider";

export class MenuHandlers implements IWidgetHandler<MenuModel> {
    constructor(private readonly visibilityCommandProvider: IVisibilityContextCommandProvider) { }

    public async getWidgetOrder(): Promise<IWidgetOrder<MenuModel>> {
        const widgetOrder: IWidgetOrder<MenuModel> = {
            name: "menu",
            displayName: "Menu",
            iconClass: "widget-icon widget-icon-menu",
            requires: ["js"],
            createModel: async () => new MenuModel(),
        };

        return widgetOrder;
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const visibilityCommand = this.visibilityCommandProvider.create(context);

        const selectCommands = [
            openWidgetEditorCommand(context, "Edit menu"),
            splitter(),
            switchToParentCommand(context),
        ];

        if (visibilityCommand) {
            selectCommands.push(visibilityCommand);
        }

        const contextualEditor: IContextCommandSet = {
            color: "#2b87da",
            selectCommands: selectCommands,
            deleteCommand: deleteWidgetCommand(context)
        };

        return contextualEditor;
    }
}