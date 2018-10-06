import { IWidgetHandler, GridHelper } from "@paperbits/common/editing";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextualEditor, IViewManager } from "@paperbits/common/ui";
import { ColumnModel } from "./columnModel";


export class ColumnHandlers implements IWidgetHandler {
    constructor(private readonly viewManager: IViewManager) { }

    public onDragOver(dragSession: DragSession): boolean {
        return dragSession.type === "widget";
    }

    public onDragDrop(dragSession: DragSession): void {
        if (dragSession.type === "widget") {
            dragSession.targetBinding.model.widgets.splice(dragSession.insertIndex, 0, dragSession.sourceModel);
        }
        dragSession.targetBinding.applyChanges();
    }

    public getContextualEditor(element: HTMLElement): IContextualEditor {
        const columnContextualEditor: IContextualEditor = {
            element: element,
            color: "#4c5866",
            hoverCommand: null,
            deleteCommand: null,
            selectionCommands: [{
                tooltip: "Edit column",
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#4c5866",
                callback: () => {
                    const binding = GridHelper.getWidgetBinding(element);
                    this.viewManager.openWidgetEditor(binding);
                }
            }]
        };

        const attachedModel = <ColumnModel>GridHelper.getModel(element);

        if (attachedModel.widgets.length === 0) {
            columnContextualEditor.hoverCommand = {
                color: "#607d8b",
                position: "center",
                tooltip: "Add widget",
                component: {
                    name: "widget-selector",
                    params: {
                        onRequest: () => {
                            const parentElement = GridHelper.getParentElementWithModel(element);
                            const bindings = GridHelper.getParentWidgetBindings(parentElement);
                            const provided = bindings
                                .filter(x => !!x.provides)
                                .map(x => x.provides)
                                .reduce((acc, val) => acc.concat(val));

                            return provided;
                        },
                        onSelect: (widgetModel: any) => {
                            const columnModel = <ColumnModel>GridHelper.getModel(element);
                            const columnWidgetBinding = GridHelper.getWidgetBinding(element);

                            columnModel.widgets.push(widgetModel);
                            columnWidgetBinding.applyChanges();

                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            };
        }

        return columnContextualEditor;
    }
}