import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { WidgetContext } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { SectionModel } from "../section";
import { AccordionItemModel } from "./accordionModel";
import { WidgetModel } from "@paperbits/common/widgets";


export class AccordionItemHandlers {
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
                    displayName: "Edit accordion",
                    callback: () => this.viewManager.openWidgetEditor(context.parentBinding)
                },
                {
                    controlType: "toolbox-splitter"
                },
                {
                    controlType: "toolbox-button",
                    displayName: context.binding.model.label,
                    tooltip: "Accordion settings",
                    position: "top right",
                    color: "#607d8b",
                    callback: () => this.viewManager.openWidgetEditor(context.binding)
                },
                {
                    tooltip: "Select accordion",
                    iconClass: "paperbits-icon paperbits-small-down",
                    controlType: "toolbox-dropdown",
                    component: {
                        name: "accordion-item-selector",
                        params: {
                            activeAccordionItemModel: context.model,
                            accordionItemModels: context.parentBinding.model.accordionItems,
                            // onSelect: (item: AccordionItemModel): void => {
                            //     const parent = context.gridItem.getParent();
                            //     const index = parent.binding.model.accordionItems.indexOf(item);
                            //     parent.getChildren()[index].select(true);
                            // },
                            onCreate: (): void => {
                                context.parentBinding.model.accordionItems.push(new AccordionItemModel(`Item ${context.parentBinding.model.accordionItems.length + 1}`));
                                context.parentBinding.applyChanges();

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

        if (context.parentModel["accordionItems"].length > 1) {
            contextualEditor.deleteCommand = {
                controlType: "toolbox-button",
                tooltip: "Delete item",
                color: "#607d8b",
                callback: () => {
                    context.parentModel["accordionItems"].remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
                }
            };
        }
        else {
            const accordionParentBinding = context.gridItem.getParent().getParent().binding;
            const accordionParentModel = accordionParentBinding.model;
            const accordionModel = context.gridItem.getParent().binding.model;

            contextualEditor.deleteCommand = {
                controlType: "toolbox-button",
                tooltip: "Delete accordion",
                callback: () => {
                    accordionParentModel.widgets.remove(accordionModel);
                    accordionParentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
                }
            };
        }

        if (context.model.widgets.length === 0) {
            contextualEditor.hoverCommands.push({
                controlType: "toolbox-button",
                color: "#607d8b",
                iconClass: "paperbits-icon paperbits-simple-add",
                position: "center",
                tooltip: "Add widget",
                component: {
                    name: "widget-selector",
                    params: {
                        onRequest: () => context.providers,
                        onSelect: (widget: WidgetModel) => {
                            context.model.widgets.push(widget);
                            context.binding.applyChanges();
                            this.eventManager.dispatchEvent(Events.ContentUpdate);
                            this.viewManager.clearContextualCommands();
                        }
                    }
                }
            });
        }

        return contextualEditor;
    }
}
