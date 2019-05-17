import * as ko from "knockout";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { GridHelper } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";
import { GridEditor } from "../../grid/ko/gridEditor";
import { IWidgetService } from "@paperbits/common/widgets";

export class GridBindingHandler {
    constructor(
        viewManager: IViewManager,
        eventManager: IEventManager,
        widgetService: IWidgetService,
        gridEditor: GridEditor,
    ) {
        ko.bindingHandlers["grid"] = {
            init(gridElement: HTMLElement): void {
                gridEditor.attach(gridElement.ownerDocument);
            }
        };

        ko.virtualElements.allowedBindings["grid"] = true;

        ko.bindingHandlers["layoutsection"] = {
            init(sourceElement: HTMLElement): void {
                GridBindingHandler.attachSectionDragEvents(sourceElement, viewManager, eventManager, widgetService);
            }
        };

        ko.bindingHandlers["layoutrow"] = {
            init(element: HTMLElement): void {
                GridBindingHandler.attachRowDragEvents(element, viewManager, eventManager, widgetService);
            }
        };

        ko.bindingHandlers["layoutcolumn"] = {
            init(element: HTMLElement): void {
                GridBindingHandler.attachColumnDragEvents(element, viewManager, eventManager, widgetService);
            }
        };

        ko.bindingHandlers["layoutwidget"] = {
            init(element: HTMLElement): void {
                GridBindingHandler.attachWidgetDragEvents(element, viewManager, eventManager, widgetService);
            }
        };

        ko.virtualElements.allowedBindings["layoutwidget"] = true;
    }

    public static attachSectionDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager, widgetService: IWidgetService): void {
        let placeholderElement: HTMLElement;

        const onDragStart = (): HTMLElement => {
            const placeholderWidth = sourceElement.clientWidth - 1 + "px";
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";
            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const parentBinding = GridHelper.getParentWidgetBinding(sourceElement);
            const parentModel = parentBinding.model;

            placeholderElement = sourceElement.ownerDocument.createElement("div");
            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("dragged-origin");
            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);
            viewManager.beginDrag({
                type: "section",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                sourceParentModel: parentModel,
                sourceParentBinding: parentBinding
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
                parentModel.widgets.remove(model); // TODO: Replace "sections" with "children".
            }

            if (acceptorBinding && acceptorBinding.handler) {
                const widgetHandler = widgetService.getWidgetHandler(acceptorBinding.handler);
                widgetHandler.onDragDrop(dragSession);
            }

            placeholderElement.remove();
            eventManager.dispatchEvent("virtualDragEnd");
        };

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        };

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        }, null);
    }

    public static attachRowDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager, widgetService: IWidgetService): void {
        let placeholderElement: HTMLElement;

        const onDragStart = (): HTMLElement => {
            const placeholderWidth = sourceElement.clientWidth - 1 + "px";
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";
            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const parentBinding = GridHelper.getParentWidgetBinding(sourceElement);
            const parentModel = parentBinding.model;

            placeholderElement = sourceElement.ownerDocument.createElement("div");
            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("dragged-origin");

            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                type: "row",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                sourceParentModel: parentModel,
                sourceParentBinding: parentBinding
            });

            return sourceElement;
        };

        const onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const parentBinding = dragSession.sourceParentBinding;
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const parentModel = <any>dragSession.sourceParentModel;
                const model = <any>dragSession.sourceModel;

                parentModel.widgets.remove(model);
            }

            if (acceptorBinding && acceptorBinding.handler) {
                const widgetHandler = widgetService.getWidgetHandler(acceptorBinding.handler);
                widgetHandler.onDragDrop(dragSession);
            }

            placeholderElement.remove();
            eventManager.dispatchEvent("virtualDragEnd");
        };

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        };

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        }, null);
    }

    public static attachColumnDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager, widgetService: IWidgetService): void {
        let placeholderElement: HTMLElement;

        const onDragStart = (): HTMLElement => {
            const placeholderWidth = sourceElement.clientWidth - 1 + "px";
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";
            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const parentBinding = GridHelper.getParentWidgetBinding(sourceElement);
            const parentModel = parentBinding.model;

            placeholderElement = sourceElement.ownerDocument.createElement("div");
            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("dragged-origin");

            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                type: "column",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                sourceParentModel: parentModel,
                sourceParentBinding: parentBinding
            });

            return sourceElement;
        };

        const onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const parentModel = <any>dragSession.sourceParentModel;
                const model = <any>dragSession.sourceModel;

                parentModel.widgets.remove(model);
            }

            if (acceptorBinding && acceptorBinding.handler) {
                const widgetHandler = widgetService.getWidgetHandler(acceptorBinding.handler);
                widgetHandler.onDragDrop(dragSession);
            }

            placeholderElement.remove();
            eventManager.dispatchEvent("virtualDragEnd");
        };

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        };

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        }, null);
    }

    public static attachWidgetDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager, widgetService: IWidgetService): void {
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
                type: "widget",
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
                widgetHandler.onDragDrop(dragSession);
            }

            placeholderElement.remove();

            eventManager.dispatchEvent("virtualDragEnd");
        };

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        };

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        }, null);
    }
}
