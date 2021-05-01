import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextCommandSet, View, ViewManager } from "@paperbits/common/ui";
import { WidgetModel } from "@paperbits/common/widgets";
import { TableModel } from "../table/tableModel";


export class TableCellHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public canAccept(dragSession: DragSession): boolean {
        return !["section", "row", "column"].includes(dragSession.sourceBinding.name);
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const tableCellContextualEditor: IContextCommandSet = {
            color: "#9C27B0",
            hoverCommands: [],
            deleteCommand: null,
            selectCommands: [{
                tooltip: "Edit table cell",
                iconClass: "paperbits-icon paperbits-edit-72",
                position: "top right",
                color: "#9C27B0",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                tooltip: "Switch to parent",
                iconClass: "paperbits-icon paperbits-enlarge-vertical",
                position: "top right",
                color: "#9C27B0",
                callback: () => {
                    context.switchToParent();
                }
            }]
        };

        if (context.model.widgets.length !== 0) {
            return tableCellContextualEditor;
        }

        tableCellContextualEditor.hoverCommands.push({
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
                        this.eventManager.dispatchEvent("onContentUpdate");
                        this.viewManager.clearContextualEditors();
                    }
                }
            }
        });

        tableCellContextualEditor.hoverCommands.push({
            color: "#607d8b",
            iconClass: "paperbits-icon paperbits-edit-72",
            position: "parent-left",
            tooltip: "Edit row",
            callback: () => {
                const view: View = {
                    heading: "Table row",
                    component: {
                        name: "table-row-editor",
                        params: {
                            model: context.parentModel,
                            cellModel: context.model,
                            rowIndex: Math.floor(context.parentModel.widgets.indexOf(context.model) / context.parentModel["numOfCols"]),
                            onChange: (model: TableModel) => {
                                context.parentBinding.applyChanges();
                                this.eventManager.dispatchEvent("onContentUpdate");
                                // this.viewManager.clearContextualEditors();
                            }
                        }
                    }
                };
                this.viewManager.openViewAsPopup(view);
            }
        });

        tableCellContextualEditor.hoverCommands.push({
            color: "#607d8b",
            iconClass: "paperbits-icon paperbits-edit-72",
            position: "parent-top",
            tooltip: "Edit column",
            callback: () => {
                const view: View = {
                    heading: "Table column",
                    component: {
                        name: "table-column-editor",
                        params: {
                            model: context.parentModel,
                            columnIndex: context.parentModel.widgets.indexOf(context.model),
                            onChange: (model: TableModel) => {
                                context.parentBinding.applyChanges();
                                this.eventManager.dispatchEvent("onContentUpdate");
                                // this.viewManager.clearContextualEditors();
                            }
                        }
                    }
                };
                this.viewManager.openViewAsPopup(view);
            }
        });

        return tableCellContextualEditor;
    }
}