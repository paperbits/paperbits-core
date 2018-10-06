import { IWidgetHandler, GridHelper } from "@paperbits/common/editing";
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
                columnToInsert.sizeMd = 3;
                columnToInsert.widgets.push(dragSession.sourceModel);
                dragSession.targetBinding.model.widgets.splice(dragSession.insertIndex, 0, columnToInsert);
                break;
        }
        dragSession.targetBinding.applyChanges();
    }

    public getContextualEditor(element: HTMLElement, half: string): IContextualEditor {
        const rowContextualEditor: IContextualEditor = {
            element: element,
            color: "#29c4a9",
            hoverCommand: {
                color: "#29c4a9",
                position: half,
                tooltip: "Add row",
                component: {
                    name: "row-layout-selector",
                    params: {
                        onSelect: (newRowModel: RowModel) => {
                            const parentElement = GridHelper.getParentElementWithModel(element);
                            const parentModel = GridHelper.getModel(parentElement);
                            const parentWidgetModel = GridHelper.getWidgetBinding(parentElement);
                            const rowModel = GridHelper.getModel(element);
                            let index = parentModel.widgets.indexOf(rowModel);

                            if (half === "bottom") {
                                index++;
                            }

                            parentModel.widgets.splice(index, 0, newRowModel);
                            parentWidgetModel.applyChanges();

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
                    const parentElement = GridHelper.getParentElementWithModel(element);
                    const parentModel = GridHelper.getModel(parentElement);
                    const parentBinding = GridHelper.getWidgetBinding(parentElement);
                    const rowModel = GridHelper.getModel(element);

                    parentModel.widgets.remove(rowModel);
                    parentBinding.applyChanges();

                    this.viewManager.clearContextualEditors();
                }
            }
        };

        return rowContextualEditor;
    }
}