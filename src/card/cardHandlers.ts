import { CardModel } from "./cardModel";
import { IWidgetOrder, IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextualEditor, IViewManager } from "@paperbits/common/ui";
import { WidgetModel } from "@paperbits/common/widgets";


export class CardHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: IViewManager,
        private readonly eventManager: IEventManager
    ) { }

    public onDragOver(dragSession: DragSession): boolean {
        return dragSession.type === "widget";
    }

    public onDragDrop(dragSession: DragSession): void {
        if (dragSession.type === "widget") {
            dragSession.targetBinding.model.widgets.splice(dragSession.insertIndex, 0, dragSession.sourceModel);
        }
        dragSession.targetBinding.applyChanges();
    }

    public getContextualEditor(context: WidgetContext): IContextualEditor {
        const cardContextualEditor: IContextualEditor = {
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
            selectionCommands: [{
                tooltip: "Edit card",
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
            createModel: async () => {
                return new CardModel();
            }
        };

        return widgetOrder;
    }
}