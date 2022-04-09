import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { WidgetContext } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { SectionModel } from "../section";
import { TabPanelItemModel } from "./tabPanelModel";


export class TabPanelItemHandlers {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {
            color: "#2b87da",
            hoverCommands: [],
            deleteCommand: null,
            selectCommands: [
                {
                    controlType: "toolbox-button",
                    displayName: "Tab panel",
                    callback: () => this.viewManager.openWidgetEditor(context.parentBinding)
                },
                {
                    controlType: "toolbox-splitter"
                },
                {
                    controlType: "toolbox-button",
                    displayName: context.binding.displayName,
                    tooltip: "Tab settings",
                    position: "top right",
                    color: "#607d8b",
                    callback: () => this.viewManager.openWidgetEditor(context.binding)
                },
                {
                    tooltip: "Select tab",
                    iconClass: "paperbits-icon paperbits-small-down",
                    controlType: "toolbox-dropdown",
                    component: {
                        name: "tabpanel-item-selector",
                        params: {
                            activeTabPanelItemModel: context.model,
                            tabPanelItemModels: context.parentBinding.model.tabPanelItems,
                            onSelect: (item: TabPanelItemModel): void => {
                                const index = context.parentBinding.model.tabPanelItems.indexOf(item);
                                context.parentBinding["setActiveItem"](index);
                                this.viewManager.clearContextualCommands();
                            },
                            onCreate: (): void => {
                                context.binding.model.tabPanelItems.push(new TabPanelItemModel());

                                const index = context.binding.model.tabPanelItems.length - 1;

                                context.binding.applyChanges();
                                context.binding["setActiveItem"](index);

                                this.viewManager.clearContextualCommands();
                                this.eventManager.dispatchEvent(Events.ContentUpdate);
                            }
                        }
                    }
                },
                {
                    controlType: "toolbox-splitter"
                }
            ]
        };

        if (context.parentModel["tabPanelItems"].length > 1) {
            contextualEditor.deleteCommand = {
                controlType: "toolbox-button",
                tooltip: "Delete tab",
                color: "#607d8b",
                callback: () => {
                    context.parentModel["tabPanelItems"].remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                    this.eventManager.dispatchEvent(Events.ContentUpdate);

                    context.parentBinding["setActiveItem"](0);
                }
            };
        }

        if (context.model.widgets.length === 0) {
            contextualEditor.hoverCommands.push({
                color: "#607d8b",
                controlType: "toolbox-button",
                iconClass: "paperbits-icon paperbits-simple-add",
                position: "center",
                tooltip: "Set tab layout",
                component: {
                    name: "grid-layout-selector",
                    params: {
                        heading: "Set tab layout",
                        onSelect: (section: SectionModel) => { // TODO: Here should come Grid model
                            context.model.widgets = section.widgets;
                            context.binding.applyChanges();

                            this.viewManager.clearContextualCommands();
                            this.eventManager.dispatchEvent(Events.ContentUpdate);
                        }
                    }
                }
            });
        }

        return contextualEditor;
    }
}