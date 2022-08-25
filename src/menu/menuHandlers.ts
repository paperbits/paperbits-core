import { IWidgetOrder, IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IContextCommandSet, View, ViewManager } from "@paperbits/common/ui";
import { MenuModel } from "./menuModel";

export class MenuHandlers implements IWidgetHandler {
    constructor(private readonly viewManager: ViewManager) { }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "menu",
            displayName: "Menu",
            iconClass: "widget-icon widget-icon-menu",
            requires: ["js"],
            createModel: async () => new MenuModel()
        };

        return widgetOrder;
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
            color: "#2b87da",
            selectCommands: [{
                controlType: "toolbox-button",
                displayName: "Edit menu",
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
            },
            {
                controlType: "toolbox-button",
                tooltip: "Change visibility",
                iconClass: "paperbits-icon paperbits-a-security",
                position: "top right",
                color: "#607d8b",
                callback: () => {
                    const view: View = {
                        heading: `Visibility`,
                        component: {
                            name: "role-based-security-model-editor",
                            params: {
                                securityModel: context.binding.model.security,
                                onChange: (securityModel): void => {
                                    context.binding.model.security = securityModel;
                                    context.binding.applyChanges(context.binding.model);
                                }
                            }
                        },
                        resizing: "vertically horizontally"
                    };

                    this.viewManager.openViewAsPopup(view);
                }
            }],
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