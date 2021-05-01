import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { ColumnModel } from "../column/columnModel";
import { RowModel } from "../row/rowModel";


export class RowHandlers implements IWidgetHandler {
    constructor(private readonly viewManager: ViewManager) { }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const rowContextualEditor: IContextCommandSet = {
            color: "#29c4a9",
            hoverCommands: [{
                color: "#29c4a9",
                iconClass: "paperbits-icon paperbits-simple-add",
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
            }],
            selectCommands: null,
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