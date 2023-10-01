import { IWidgetHandler, IWidgetOrder, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet } from "@paperbits/common/ui";
import { deleteWidgetCommand, openWidgetEditorCommand, splitter, switchToParentCommand } from "@paperbits/common/ui/commands";
import { MenuModel } from "./menuModel";
import { IVisibilityCommandProvider } from "../security/visibilityContextCommandProvider";

export class MenuHandlers implements IWidgetHandler {
    constructor(private readonly visibilityCommandProvider: IVisibilityCommandProvider) { }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "menu",
            displayName: "Menu",
            iconClass: "widget-icon widget-icon-menu",
            requires: ["js"],
            createModel: async () => new MenuModel(),
        };

        return widgetOrder;
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
            color: "#2b87da",
            selectCommands: [
                openWidgetEditorCommand(context, "Edit menu"),
                splitter(),
                switchToParentCommand(context),
                this.visibilityCommandProvider.create(context),
            ],
            deleteCommand: deleteWidgetCommand(context)
        };

        return contextualEditor;
    }
}