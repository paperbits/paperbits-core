import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextualEditor, IViewManager } from "@paperbits/common/ui";
import { WidgetModel } from "@paperbits/common/widgets";


export class ColumnHandlers implements IWidgetHandler {
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
        const columnContextualEditor: IContextualEditor = {
            color: "#9C27B0",
            hoverCommand: null,
            deleteCommand: null,
            selectionCommands: [{
                tooltip: "Edit column",
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#9C27B0",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            }]
        };


        if (context.model.widgets.length === 0) {
            columnContextualEditor.hoverCommand = {
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

        return columnContextualEditor;
    }
}