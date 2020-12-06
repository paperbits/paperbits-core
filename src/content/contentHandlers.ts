import { DragSession } from "@paperbits/common/ui/draggables";
import { ViewManager, IContextCommandSet } from "@paperbits/common/ui";
import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { WidgetModel } from "@paperbits/common/widgets";
import { GridCellModel } from "../grid-cell";


export class ContentHandlers implements IWidgetHandler {
    constructor(private readonly viewManager: ViewManager) { }

    public canAccept(dragSession: DragSession): boolean {
        return dragSession.sourceBinding.name === "section";
    }

    public getContextualEditor(context: WidgetContext): IContextCommandSet {
        const contextualEditor: IContextCommandSet = {};

        if (context.model.widgets.length === 0) {
            contextualEditor.hoverCommands = [{
                color: "#2b87da",
                position: "center",
                tooltip: "Add section",
                component: {
                    name: "grid-layout-selector",
                    params: {
                        onSelect: (model: WidgetModel) => {
                            context.model.widgets.push(model);
                            context.binding.applyChanges();
                            this.viewManager.clearContextualEditors();
                        }
                    }
                }
            }];
        }

        return contextualEditor;
    }
}