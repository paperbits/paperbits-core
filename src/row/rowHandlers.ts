import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextualEditor, IViewManager } from "@paperbits/common/ui";
import { ColumnModel } from "../column/columnModel";
import { RowModel } from "../row/rowModel";


export class RowHandlers implements IWidgetHandler {
    constructor(private readonly viewManager: IViewManager) { }

    public onDragOver(dragSession: DragSession): boolean {
        return dragSession.type === "column";
    }

    public onDragDrop(dragSession: DragSession): void {
        switch (dragSession.type) {
            case "column":
                dragSession.targetBinding.model.widgets.splice(dragSession.insertIndex, 0, dragSession.sourceModel);
                break;

            case "widget":
                const columnToInsert = new ColumnModel();
                columnToInsert.size.md = 3;
                columnToInsert.widgets.push(dragSession.sourceModel);
                dragSession.targetBinding.model.widgets.splice(dragSession.insertIndex, 0, columnToInsert);
                break;
        }
        dragSession.targetBinding.applyChanges();
    }

    public getContextualEditor(context: WidgetContext): IContextualEditor {
        const rowContextualEditor: IContextualEditor = {
            color: "#29c4a9",
            hoverCommand: {
                color: "#29c4a9",
                position: context.half,
                tooltip: "Add row",
                component: {
                    name: "row-layout-selector",
                    params: {
                        onSelect: (newRowModel: RowModel) => {
                            let index = context.parentModel.widgets.indexOf(context.model);

                            if (context.half === "bottom") {
                                index++;
                            }

                            context.parentModel.widgets.splice(index, 0, newRowModel);
                            context.parentBinding.applyChanges();

                            this.viewManager.clearContextualEditors();
                        }
                    }
                },
            },
            selectionCommands: null,
            deleteCommand: {
                tooltip: "Delete row",
                color: "#29c4a9",
                callback: () => {
                    context.parentModel.widgets.remove(context.model);
                    context.parentBinding.applyChanges();

                    this.viewManager.clearContextualEditors();
                }
            }
        };

        return rowContextualEditor;
    }
}