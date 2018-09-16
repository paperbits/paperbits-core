import * as ko from "knockout";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { LayoutModelBinder } from "../../layout/layoutModelBinder";
import { GridHelper } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";
import { PageModelBinder } from "../../page";
import { GridEditor } from "../../grid/ko/gridEditor";

export class GridBindingHandler {
    constructor(viewManager: IViewManager, eventManager: IEventManager, pageModelBinder: PageModelBinder, layoutModelBinder: LayoutModelBinder) {
        ko.bindingHandlers["page-grid"] = {
            init(gridElement: HTMLElement) {
                const gridEditor = new GridEditor(<any>viewManager, gridElement.ownerDocument);

                // TODO: Replace active observer with some reactive logic.
                const observer = new MutationObserver(mutations => {
                    if (viewManager.mode === ViewManagerMode.dragging) {
                        return;
                    }

                    const layoutModel = GridHelper.getModel(gridElement);
                    layoutModelBinder.updateContent(layoutModel);
                });

                observer.observe(gridElement, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });

                ko.utils.domNodeDisposal.addDisposeCallback(gridElement, () => {
                    gridEditor.detach();
                    observer.disconnect();
                });

                gridEditor.attach();
            }
        };

        ko.bindingHandlers["content-grid"] = {
            init(gridElement: HTMLElement) {
                // TODO: Replace active observer with some reactive logic.
                const observer = new MutationObserver(mutations => {
                    if (viewManager.mode === ViewManagerMode.dragging) {
                        return;
                    }

                    const model = GridHelper.getModel(gridElement);
                    pageModelBinder.updateContent(model);
                });

                observer.observe(gridElement, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });

                ko.utils.domNodeDisposal.addDisposeCallback(gridElement, () => {
                    observer.disconnect();
                });
            }
        };

        ko.bindingHandlers["layoutsection"] = {
            init(sourceElement: HTMLElement) {
                GridBindingHandler.attachSectionDragEvents(sourceElement, viewManager, eventManager);
            }
        };

        ko.bindingHandlers["layoutrow"] = {
            init(sourceElement: HTMLElement) {
                GridBindingHandler.attachRowDragEvents(sourceElement, viewManager, eventManager);
            }
        };

        ko.bindingHandlers["layoutcolumn"] = {
            init(sourceElement: HTMLElement) {
                GridBindingHandler.attachColumnDragEvents(sourceElement, viewManager, eventManager);
            }
        };
    }

    public static attachSectionDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager): void {
        const onDragStart = (item): HTMLElement => {
            const placeholderWidth = sourceElement.clientWidth - 1 + "px";
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";

            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const sourceParentElement = GridHelper.getParentElementWithModel(sourceElement);
            const parentModel = GridHelper.getModel(sourceParentElement);
            const parentBinding = GridHelper.getWidgetBinding(sourceParentElement);
            const placeholderElement = sourceElement.ownerDocument.createElement("div");

            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("placeholder");

            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                type: "section",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                parentModel: parentModel,
                parentBinding: parentBinding
            });

            return sourceElement;
        };

        const onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const parentBinding = dragSession.parentBinding;
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const parentModel = <any>dragSession.parentModel;
                const model = dragSession.sourceModel;
                parentModel.widgets.remove(model); // TODO: Replace "sections" with "children".
            }

            parentBinding.applyChanges();

            if (acceptorBinding) {
                acceptorBinding.onDragDrop(dragSession);
            }

            eventManager.dispatchEvent("virtualDragEnd");
        };

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        };

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        });
    }

    public static attachRowDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager): void {
        const onDragStart = (): HTMLElement => {
            const placeholderWidth = sourceElement.clientWidth - 1 + "px";
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";

            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const sourceParentElement = GridHelper.getParentElementWithModel(sourceElement);
            const parentModel = GridHelper.getModel(sourceParentElement);
            const parentBinding = GridHelper.getWidgetBinding(sourceParentElement);

            const placeholderElement = sourceElement.ownerDocument.createElement("div");
            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("placeholder");

            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                type: "row",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                parentModel: parentModel,
                parentBinding: parentBinding
            });

            return sourceElement;
        };

        const onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const parentBinding = dragSession.parentBinding;
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const parentModel = <any>dragSession.parentModel;
                const model = <any>dragSession.sourceModel;

                parentModel.widgets.remove(model);
            }

            parentBinding.applyChanges();

            if (acceptorBinding) {
                acceptorBinding.onDragDrop(dragSession);
            }

            eventManager.dispatchEvent("virtualDragEnd");
        };

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        };

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        });
    }

    public static attachColumnDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager): void {
        const onDragStart = (): HTMLElement => {
            const placeholderWidth = sourceElement.clientWidth - 1 + "px";
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";

            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const sourceParentElement = GridHelper.getParentElementWithModel(sourceElement);
            const parentModel = GridHelper.getModel(sourceParentElement);
            const parentBinding = GridHelper.getWidgetBinding(sourceParentElement);

            const placeholderElement = sourceElement.ownerDocument.createElement("div");
            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("placeholder");

            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                type: "column",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                parentModel: parentModel,
                parentBinding: parentBinding
            });

            return sourceElement;
        };

        const onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const parentBinding = dragSession.parentBinding;
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const parentModel = <any>dragSession.parentModel;
                const model = <any>dragSession.sourceModel;

                parentModel.widgets.remove(model);
            }

            parentBinding.applyChanges();

            if (acceptorBinding) {
                acceptorBinding.onDragDrop(dragSession);
            }

            eventManager.dispatchEvent("virtualDragEnd");
        };

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        };

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        });
    }

    public static attachWidgetDragEvents(sourceElement: HTMLElement, viewManager: IViewManager, eventManager: IEventManager): void {
        const onDragStart = (item): HTMLElement => {
            if (viewManager.mode === ViewManagerMode.configure) {
                return;
            }

            const placeholderWidth = sourceElement.clientWidth - 1 + "px";
            const placeholderHeight = sourceElement.clientHeight - 1 + "px";

            const sourceBinding = GridHelper.getWidgetBinding(sourceElement);
            const sourceModel = GridHelper.getModel(sourceElement);
            const sourceParentElement = GridHelper.getParentElementWithModel(sourceElement);
            const parentModel = GridHelper.getModel(sourceParentElement);
            const parentBinding = GridHelper.getWidgetBinding(sourceParentElement);

            const placeholderElement = sourceElement.ownerDocument.createElement("div");
            placeholderElement.style.height = placeholderHeight;
            placeholderElement.style.width = placeholderWidth;
            placeholderElement.classList.add("placeholder");

            sourceElement.parentNode.insertBefore(placeholderElement, sourceElement.nextSibling);

            viewManager.beginDrag({
                type: "widget",
                sourceElement: sourceElement,
                sourceModel: sourceModel,
                sourceBinding: sourceBinding,
                parentModel: parentModel,
                parentBinding: parentBinding,
            });

            return sourceElement;
        };

        const onDragEnd = () => {
            const dragSession = viewManager.getDragSession();
            const parentBinding = dragSession.parentBinding;
            const acceptorElement = dragSession.targetElement;
            const acceptorBinding = dragSession.targetBinding;

            if (acceptorElement) {
                const parentModel = <any>dragSession.parentModel;
                const model = dragSession.sourceModel;

                parentModel.widgets.remove(model); // replace widgets with "children"
            }

            parentBinding.applyChanges();

            if (acceptorBinding) {
                acceptorBinding.onDragDrop(dragSession);
            }

            eventManager.dispatchEvent("virtualDragEnd");
        };

        const preventDragging = (): boolean => {
            return viewManager.mode === ViewManagerMode.configure;
        };

        ko.applyBindingsToNode(sourceElement, {
            dragsource: { sticky: true, ondragstart: onDragStart, ondragend: onDragEnd, preventDragging: preventDragging }
        });
    }
}
