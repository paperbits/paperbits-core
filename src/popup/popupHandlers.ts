import { IWidgetHandler, WidgetContext } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IContextCommandSet, ViewManager } from "@paperbits/common/ui";
import { WidgetModel } from "@paperbits/common/widgets";


export class PopupHandlers implements IWidgetHandler {
    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    public canAccept(dragSession: DragSession): boolean {
        return !["section", "row", "column", "popup"].includes(dragSession.sourceBinding.name);
    }

    public getContextCommands(context: WidgetContext): IContextCommandSet {
        const popupContextualEditor: IContextCommandSet = {
            color: "#4c5866",
            hoverCommands: [],
            selectCommands: [{
                tooltip: "Edit popup",
                iconClass: "paperbits-icon paperbits-edit-72",
                position: "top right",
                color: "#4c5866",
                callback: () => this.viewManager.openWidgetEditor(context.binding)
            }]
        };

        if (context.model.widgets.length === 0) {
            popupContextualEditor.hoverCommands.push({
                color: "#607d8b",
                position: "center",
                iconClass: "paperbits-icon paperbits-simple-add",
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
        }

        return popupContextualEditor;
    }
}