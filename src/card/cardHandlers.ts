import { IWidgetOrder, IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { WidgetModel } from "@paperbits/common/widgets";
import { CardModel } from "./cardModel";
import { GridCellModel } from "../grid-cell";
import { TextblockModel } from "./../textblock/textblockModel";


export class CardHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public canAccept(dragSession: DragSession): boolean {
        return !["section", "row", "column", "card"].includes(dragSession.sourceBinding.name);
    }

    public getContextualEditor(context: WidgetContext): IContextCommandSet {
        const cardContextualEditor: IContextCommandSet = {
            color: "#4c5866",
            hoverCommands: [{
                color: "#607d8b",
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

                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            }],
            deleteCommand: {
                tooltip: "Delete card",
                color: "#4c5866",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();
                    this.viewManager.clearContextualEditors();
                    this.eventManager.dispatchEvent("onContentUpdate");
                }
            },
            selectCommands: [{
                tooltip: "Edit card",
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#4c5866",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                tooltip: "Switch to parent",
                iconClass: "paperbits-enlarge-vertical",
                position: "top right",
                color: "#4c5866",
                callback: () => {
                    context.switchToParent(GridCellModel);
                }
            }]
        };

        if (context.model.widgets.length === 0) {
            cardContextualEditor.hoverCommands.push({
                color: "#607d8b",
                position: "center",
                tooltip: "Add widget",
                component: {
                    name: "widget-selector",
                    params: {
                        onRequest: () => context.providers,
                        onSelect: (widget: WidgetModel) => {
                            context.model.widgets.push(widget);
                            context.binding.applyChanges();
                            this.eventManager.dispatchEvent("onContentUpdate");
                            this.viewManager.clearContextualEditors();
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
            iconClass: "paperbits-polaroid",
            requires: ["html"],
            createModel: async () => {
                const textblock: any = new TextblockModel([
                    {
                        type: "heading1",
                        content: [{ type: "text", text: "Card" }]
                    },
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor..." }]
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