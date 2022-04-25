import { IContextCommandSet, View, ViewManager } from "@paperbits/common/ui";
import { IWidgetOrder, WidgetContext } from "@paperbits/common/editing";
import { TabPanelItemModel, TabPanelModel } from "./tabPanelModel";
import { EventManager, Events } from "@paperbits/common/events";


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
        // const activeTabIndex = context.binding["getActiveItem"]();
        // const activeTab = context.binding.model.tabPanelItems[activeTabIndex];

        const tabPanelContextualEditor: IContextCommandSet = {
            hoverCommands: null,
            defaultCommand: null,
            deleteCommand: {
                controlType: "toolbox-button",
                tooltip: "Delete tab panel",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
                }
            },
            selectCommands: [{
                controlType: "toolbox-button",
                displayName: "Tab panel",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                controlType: "toolbox-splitter"
            },
            // {
            //     controlType: "toolbox-button",
            //     displayName: activeTab.label,
            // },
            // {
            //     tooltip: "Select tab",
            //     iconClass: "paperbits-icon paperbits-small-down",
            //     controlType: "toolbox-dropdown",
            //     component: {
            //         name: "tabpanel-item-selector",
            //         params: {
            //             activeTabPanelItemModel: activeTab,
            //             tabPanelItemModels: context.binding.model.tabPanelItems,
            //             onSelect: (item: TabPanelItemModel): void => {
            //                 const index = context.binding.model.tabPanelItems.indexOf(item);
            //                 context.binding["setActiveItem"](index);
            //                 this.viewManager.clearContextualCommands();
            //             },
            //             onCreate: (): void => {
            //                 context.binding.model.tabPanelItems.push(new TabPanelItemModel());

            //                 const index = context.binding.model.tabPanelItems.length - 1;

            //                 context.binding.applyChanges();
            //                 context.binding["setActiveItem"](index);

            //                 this.viewManager.clearContextualCommands();
            //                 this.eventManager.dispatchEvent(Events.ContentUpdate);
            //             }
            //         }
            //     }
            // },
            // {
            //     controlType: "toolbox-splitter"
            // },
            {
                controlType: "toolbox-button",
                tooltip: "Switch to parent",
                iconClass: "paperbits-icon paperbits-enlarge-vertical",
                callback: () => context.switchToParent()
            }]
        };

        return tabPanelContextualEditor;
    }
}