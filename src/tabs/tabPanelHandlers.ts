import { IContextCommandSet, View, ViewManager } from "@paperbits/common/ui";
import { IWidgetOrder, WidgetContext } from "@paperbits/common/editing";
import { TabPanelItemModel, TabPanelModel } from "./tabPanelModel";
import { EventManager } from "@paperbits/common/events";


export class TabPanelHandlers {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "tab-panel",
            displayName: "Tab panel",
            iconClass: "widget-icon widget-icon-tab-panel",
            requires: ["js", "interaction"],
            createModel: async () => {
                const model = new TabPanelModel();
                model.tabPanelItems.push(new TabPanelItemModel("Tab 1"));
                model.tabPanelItems.push(new TabPanelItemModel("Tab 2"));
                model.tabPanelItems.push(new TabPanelItemModel("Tab 3"));
                return model;
            }
        };

        return widgetOrder;
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const tabPanelContextualEditor: IContextCommandSet = {
            color: "#2b87da",
            hoverCommands: null,
            deleteCommand: {
                tooltip: "Delete tab panel",
                color: "#607d8b",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualEditors();
                    this.eventManager.dispatchEvent("onContentUpdate");
                }
            },
            selectCommands: [{
                tooltip: "Add tab",
                iconClass: "paperbits-icon paperbits-circle-add",
                position: "top right",
                color: "#607d8b",
                callback: () => {
                    context.model["tabPanelItems"].push(new TabPanelItemModel());
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualEditors();
                    this.eventManager.dispatchEvent("onContentUpdate");
                }
            },
            // {
            //     tooltip: "Edit tabPanel",
            //     iconClass: "paperbits-icon paperbits-edit-72",
            //     position: "top right",
            //     color: "#607d8b",
            //     callback: () => this.viewManager.openWidgetEditor(context.binding)
            // },
            {
                tooltip: "Switch to parent",
                iconClass: "paperbits-icon paperbits-enlarge-vertical",
                position: "top right",
                color: "#607d8b",
                callback: () => context.switchToParent()
            }]
        };

        return tabPanelContextualEditor;
    }
}