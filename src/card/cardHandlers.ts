import { IWidgetOrder, IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { WidgetModel } from "@paperbits/common/widgets";
import { CardModel } from "./cardModel";
import { TextblockModel } from "./../textblock/textblockModel";


export class CardHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public canAccept(dragSession: DragSession): boolean {
        return !["section", "row", "column", "card"].includes(dragSession.sourceBinding.name);
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const cardContextualEditor: IContextCommandSet = {
            color: "#4c5866",
            hoverCommands: [{
                controlType: "toolbox-button",
                color: "#607d8b",
                iconClass: "paperbits-icon paperbits-simple-add",
                position: context.half,
                tooltip: "Add widget",
                component: {
                    name: "widget-selector",
                    params: {
                        onRequest: () => context.providers,
                        onSelect: (newWidgetModel: any) => {
                            let index = context.parentModel.widgets.indexOf(context.model);

                            if (context.half === "bottom") {
                                index++;
                            }

                            context.parentBinding.model.widgets.splice(index, 0, newWidgetModel);
                            context.parentBinding.applyChanges();

                            this.viewManager.clearContextualCommands();
                        }
                    }
                }
            }],
            deleteCommand: {
                controlType: "toolbox-button",
                tooltip: "Delete card",
                color: "#4c5866",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualCommands();
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
                }
            },
            selectCommands: [{
                controlType: "toolbox-button",
                displayName: "Edit card",
                position: "top right",
                color: "#4c5866",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                controlType: "toolbox-splitter",
            },
            {
                controlType: "toolbox-button",
                tooltip: "Switch to parent",
                iconClass: "paperbits-icon paperbits-enlarge-vertical",
                position: "top right",
                color: "#4c5866",
                callback: () => {
                    context.switchToParent();
                }
            }]
        };

        if (context.model.widgets.length === 0) {
            cardContextualEditor.hoverCommands.push({
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

        return cardContextualEditor;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "card",
            displayName: "Card",
            iconClass: "widget-icon widget-icon-card",
            requires: ["html"],
            createModel: async () => {
                const textblock: any = new TextblockModel([
                    {
                        type: "heading1",
                        nodes: [{ type: "text", text: "Card" }]
                    },
                    {
                        type: "paragraph",
                        nodes: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor..." }]
                    }
                ]);

                const model = new CardModel();
                model.widgets.push(textblock);

                return model;
            }
        };

        return widgetOrder;
    }
}