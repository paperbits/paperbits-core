import { IWidgetHandler, IWidgetOrder, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { MenuModel } from "./menuModel";
import { IVisibilityCommandProvider } from "../security/visibilityContextCommandProvider";

export class MenuHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly visibilityCommandProvider: IVisibilityCommandProvider,
    ) {
    }

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
                {
                    controlType: "toolbox-button",
                    displayName: "Edit menu",
                    callback: () => this.viewManager.openWidgetEditor(context.binding),
                },
                {
                    controlType: "toolbox-splitter",
                },
                {
                    controlType: "toolbox-button",
                    tooltip: "Switch to parent",
                    iconClass: "paperbits-icon paperbits-enlarge-vertical",
                    callback: () => context.gridItem.getParent().select(),
                },
                this.visibilityCommandProvider.create(context),
            ],
            deleteCommand: {
                controlType: "toolbox-button",
                tooltip: "Delete widget",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                },
            },
        };

        return contextualEditor;
    }
}