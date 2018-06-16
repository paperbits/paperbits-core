import * as ko from "knockout";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui/IViewManager";
import { LayoutModelBinder } from "../../layout/layoutModelBinder";
import { GridEditor } from "@paperbits/knockout/editors/grid/gridEditor";
import { GridHelper } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";
import { PageModelBinder } from "../../page/pageModelBinder";

export class GridBindingHandler {
    constructor(viewManager: IViewManager, eventManager: IEventManager, pageModelBinder: PageModelBinder, layoutModelBinder: LayoutModelBinder) {
        ko.bindingHandlers["layout-grid"] = {
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
        }

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
        }

        ko.bindingHandlers["layoutsection"] = {
            init(sourceElement: HTMLElement) {
                GridEditor.attachSectionDragEvents(sourceElement, viewManager, eventManager);
            }
        }

        ko.bindingHandlers["layoutcolumn"] = {
            init(sourceElement: HTMLElement) {
                GridEditor.attachColumnDragEvents(sourceElement, viewManager, eventManager);
            }
        }
    }
}
