import { TextblockModel } from "./../textblock/textblockModel";
import { CardModel } from "./cardModel";
import { IWidgetOrder, IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextCommandSet, IViewManager } from "@paperbits/common/ui";
import { WidgetModel } from "@paperbits/common/widgets";


export class CardHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: IViewManager,
        private readonly eventManager: EventManager
    ) { }

    public onDragOver(dragSession: DragSession): boolean {
        return dragSession.type === "widget";
    }

    public onDragDrop(dragSession: DragSession): void {
        if (dragSession.type === "widget") {
            dragSession.targetBinding.model.widgets.splice(dragSession.insertIndex, 0, dragSession.sourceModel);
        }
        dragSession.targetBinding.applyChanges();
        dragSession.sourceParentBinding.applyChanges();
    }

    public getContextualEditor(context: WidgetContext): IContextCommandSet {
        const cardContextualEditor: IContextCommandSet = {
            color: "#4c5866",
            hoverCommand: null,
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
            }]
        };

        if (context.model.widgets.length === 0) {
            cardContextualEditor.hoverCommand = {
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
            };
        }

        return cardContextualEditor;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "card",
            displayName: "Card",
            iconClass: "paperbits-polaroid",
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