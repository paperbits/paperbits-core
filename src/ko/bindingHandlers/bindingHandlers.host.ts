import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { GlobalEventHandler } from "@paperbits/common/events";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { IRouteHandler } from "@paperbits/common/routing";

export class HostBindingHandler {
    constructor(
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly viewManager: IViewManager,
        private readonly routeHandler: IRouteHandler
    ) {
        ko.bindingHandlers["host"] = {
            init: (element: HTMLElement, valueAccessor: any) => {
                const config = valueAccessor();

                const onPointerMove = (event: MouseEvent): void => {
                    const elements = Utils.elementsFromPoint(element.ownerDocument, event.clientX, event.clientY);

                    if (elements.some(el => el.classList.contains("toolbox") || el.classList.contains("editor"))) {
                        element.classList.add("no-pointer-events");
                    }
                    else {
                        element.classList.remove("no-pointer-events");
                    }
                };

                document.addEventListener("mousemove", onPointerMove, true);

                const css = ko.observable<string>("desktop");

                config.viewport.subscribe((viewport) => {
                    this.viewManager.mode = ViewManagerMode.selecting;

                    switch (viewport) {
                        case "zoomout":
                            css("viewport-zoomout");
                            this.viewManager.mode = ViewManagerMode.pause;
                            break;

                        case "xl":
                            css("viewport-xl");
                            break;

                        case "lg":
                            css("viewport-lg");
                            break;

                        case "md":
                            css("viewport-md");
                            break;

                        case "sm":
                            css("viewport-sm");
                            break;

                        case "xs":
                            css("viewport-xs");
                            break;

                        default:
                            throw new Error("Unknown viewport");
                    }
                });

                ko.applyBindingsToNode(element, { css: css });

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    document.removeEventListener("mousemove", onPointerMove);
                });
            },

            update: (element: HTMLElement, valueAccessor: any) => {
                const config = valueAccessor();

                Array.prototype.slice.call(element.children).forEach(child => {
                    element.removeChild(child);
                });

                const src = config.doc().src;
                const componentName = config.doc().componentName;
                const hostElement = this.createIFrame(src, componentName);

                element.appendChild(hostElement);
            }
        };
    }

    private createIFrame(src: string, componentName): HTMLIFrameElement {
        const hostElement = document.createElement("iframe");
        hostElement.src = src;
        hostElement.classList.add("host");

        const onClick = (event: MouseEvent): void => {
            event.preventDefault(); // prevent default event handling for all controls
        };

        const onPointerDown = (event: MouseEvent): void => {
            // TODO: Move to GridEditor
            const htmlElement = <HTMLElement>event.target;
            const htmlLinkElement = <HTMLLinkElement>htmlElement.closest("A");

            if (!htmlLinkElement) {
                return;
            }

            if (!htmlLinkElement.closest("[contenteditable]")) {
                event.preventDefault();
            }

            if (event.ctrlKey) { // Preventing click on links if Ctrl key is not pressed.
                this.routeHandler.navigateTo(htmlLinkElement.href);
            }
        };

        const onLoad = (): void => {
            this.globalEventHandler.appendDocument(hostElement.contentDocument);
            this.setRootElement(hostElement.contentDocument.body, componentName);

            hostElement.contentDocument.addEventListener("click", onClick, true);
            hostElement.contentDocument.addEventListener("mousedown", onPointerDown, true);
        };

        hostElement.addEventListener("load", onLoad, false);

        // ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
        //     hostElement.removeEventListener("load", onLoad, false);
        //     hostElement.contentDocument.removeEventListener("click", onClick, true);
        //     hostElement.contentDocument.removeEventListener("mousedown", onPointerDown, true);
        // });

        return hostElement;
    }

    private setRootElement(parentElement: HTMLElement, componentName: string): void {
        const documentElement = parentElement.querySelector(componentName);
        ko.applyBindings({}, documentElement);

        // const documentElement = document.createElement("root");
        // documentElement.setAttribute("class", "fit");

        // parentElement.appendChild(documentElement);
        // ko.applyBindingsToNode(documentElement, { component: { name: componentName } });
    }
}