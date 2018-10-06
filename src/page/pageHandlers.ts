import { DragSession } from "@paperbits/common/ui/draggables";
import { IViewManager } from "@paperbits/common/ui";

export class PageHandlers {
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
    }
}