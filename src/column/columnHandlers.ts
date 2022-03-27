import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { WidgetModel } from "@paperbits/common/widgets";


export class ColumnHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public canAccept(dragSession: DragSession): boolean {
        return !["section", "row", "column"].includes(dragSession.sourceBinding.name);
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const columnContextualEditor: IContextCommandSet = {
            color: "#9C27B0",
            hoverCommands: [],
            deleteCommand: null,
            selectCommands: [{
                controlType: "toolbox-button",
                tooltip: "Edit column",
                position: "top right",
                color: "#9C27B0",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            }]
        };


        if (context.model.widgets.length === 0) {
            columnContextualEditor.hoverCommands.push({
                controlType: "toolbox-button",
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
                            this.eventManager.dispatchEvent(Events.ContentUpdate);
                            this.viewManager.clearContextualCommands();
                        }
                    }
                }
            });
        }

        return columnContextualEditor;
    }
}