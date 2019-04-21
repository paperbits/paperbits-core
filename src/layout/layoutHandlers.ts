import { DragSession } from "@paperbits/common/ui/draggables";
import { IViewManager, IContextCommandSet } from "@paperbits/common/ui";
import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { WidgetModel } from "@paperbits/common/widgets";


export class LayoutHandlers implements IWidgetHandler {
    constructor(private readonly viewManager: IViewManager) { }

    public onDragOver(dragSession: DragSession): boolean {
        return dragSession.type === "section";
    }

    public onDragDrop(dragSession: DragSession): void {
        switch (dragSession.type) {
            case "section":
                dragSession.targetBinding.model.widgets.splice(dragSession.insertIndex, 0, dragSession.sourceModel);
                break;

            default:
                throw new Error(`Unknown type: ${dragSession.type}`);
        }
        dragSession.targetBinding.applyChanges();
        dragSession.sourceParentBinding.applyChanges();
    }

    public getContextualEditor(context: WidgetContext): IContextCommandSet {
        const columnContextualEditor: IContextCommandSet = {
            color: "#4c5866"
        };

        // columnContextualEditor.hoverCommand = {
        //     color: "#2b87da",
        //     position: context.half,
        //     tooltip: "Add section",
        //     component: {
        //         name: "section-layout-selector",
        //         params: {
        //             onSelect: (newWidgetModel: any) => {
        //                 console.log("Layout handler added section");
        //                 let index = context.model.widgets.indexOf(context.model);

        //                 if (context.half === "bottom") {
        //                     index++;
        //                 }

        //                 context.model.widgets.splice(index, 0, newWidgetModel);
        //                 context.binding.applyChanges();

        //                 this.viewManager.clearContextualEditors();
        //             }
        //         }
        //     }
        // };

        return columnContextualEditor;
    }
}