import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextCommandSet } from "@paperbits/common/ui";
import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";


export class LayoutHandlers implements IWidgetHandler {
    public canAccept(dragSession: DragSession): boolean {
        return dragSession.sourceBinding.name === "section";
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