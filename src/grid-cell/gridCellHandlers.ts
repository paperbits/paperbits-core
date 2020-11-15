import { IWidgetHandler, WidgetContext, GridHelper } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextCommandSet, ViewManager, IHighlightConfig } from "@paperbits/common/ui";
import { WidgetModel, WidgetService } from "@paperbits/common/widgets";
import { SectionModel } from "../section";


export class GridCellHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public canAccept(dragSession: DragSession): boolean {
        return !["section", "row", "column"].includes(dragSession.sourceBinding.name);
    }

    public getContextualEditor(context: WidgetContext): IContextCommandSet {
        const gridCellContextualEditor: IContextCommandSet = {
            color: "#9C27B0",
            hoverCommands: [],
            deleteCommand: null,
            selectCommands: [{
                tooltip: "Edit grid cell",
                iconClass: "paperbits-edit-72",
                position: "top right",
                color: "#9C27B0",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            },
            {
                tooltip: "Switch to parent",
                iconClass: "paperbits-enlarge-vertical",
                position: "top right",
                color: "#9C27B0",
                callback: () => {
                    context.switchToParent(SectionModel);
                }
            }]
        };

        if (context.model.widgets.length !== 0) {
            return gridCellContextualEditor;
        }

        gridCellContextualEditor.hoverCommands.push({
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
        });

        return gridCellContextualEditor;
    }
}