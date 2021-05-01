import * as ko from "knockout";
import { ViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { GridHelper } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { GridEditor } from "../../grid/ko/gridEditor";
import { IWidgetService } from "@paperbits/common/widgets";

export class GridBindingHandler {
    constructor(
        viewManager: ViewManager,
        eventManager: EventManager,
        widgetService: IWidgetService,
        gridEditor: GridEditor,
    ) {
        ko.bindingHandlers["grid"] = {
            init(gridElement: HTMLElement): void {
                gridEditor.initialize(gridElement.ownerDocument);

                ko.utils.domNodeDisposal.addDisposeCallback(gridElement, () => {
                    gridEditor.dispose();
                });
            }
        };

        ko.virtualElements.allowedBindings["grid"] = true;

        ko.bindingHandlers["draggable"] = {
            init(element: HTMLElement): void {
                GridBindingHandler.attachWidgetDragEvents(element, viewManager, eventManager, widgetService);
            }
        };
    }

    public static attachWidgetDragEvents(sourceElement: HTMLElement, viewManager: ViewManager, eventManager: EventManager, widgetService: IWidgetService): void {
        let placeholderElement: HTMLElement;

        const onDragStart = (): HTMLElement => {
            if (viewManager.mode === ViewManagerMode.configure) {
                return;
            }
            const placeholderWidth = sourceElement.clientWidth - 1 + "px";
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";
            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const sourceParentBinding = GridHelper.getParentWidgetBinding(sourceElement);
            const sourceParentModel = sourceParentBinding.model;

            placeholderElement = sourceElement.ownerDocument.createElement("div");
            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("dragged-origin");
            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                sourceParentModel: sourceParentModel,
                sourceParentBinding: sourceParentBinding,
            });
            return sourceElement;
        };

        const onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const parentModel = <any>dragSession.sourceParentModel;
                const model = dragSession.sourceModel;

                parentModel.widgets.remove(model); // replace widgets with "children"
            }

            if (acceptorBinding && acceptorBinding.handler) {
                const widgetHandler = widgetService.getWidgetHandler(acceptorBinding.handler);

                if (widgetHandler.canAccept && widgetHandler.canAccept(dragSession)) {
                    if (widgetHandler.onDragDrop) {
                        widgetHandler.onDragDrop(dragSession);
                    }
                    else {
                        dragSession.targetBinding.model.widgets.splice(dragSession.insertIndex, 0, dragSession.sourceModel);
                        dragSession.targetBinding.applyChanges();
                        dragSession.sourceParentBinding.applyChanges();
                    }
                }
            }

            placeholderElement.remove();

            eventManager.dispatchEvent("virtualDragEnd");
        };

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        };

        ko.applyBindingsToNode(sourceElement, {
            dragsource: {
                sticky: true,
                ondragstart: onDragStart,
                ondragend: onDragEnd,
                preventDragging: preventDragging
            }
        }, null);
    }
}
