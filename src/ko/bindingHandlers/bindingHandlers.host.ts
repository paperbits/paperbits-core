import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { GlobalEventHandler } from "@paperbits/common/events";
import { IViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";

export class HostBindingHandler {
    constructor(globalEventHandler: GlobalEventHandler, viewManager: IViewManager, routeHandler: IRouteHandler) {
        ko.bindingHandlers["host"] = {
            init: (element: HTMLElement, valueAccessor: any) => {
                const config = valueAccessor();
                const css = ko.observable<string>("desktop");

                ko.applyBindingsToNode(element, { css: css });

                const hostElement: HTMLIFrameElement = document.createElement("iframe");
                hostElement.src = "/theme/index.html";
                hostElement.classList.add("host");


                config.viewport.subscribe((viewport) => {
                    viewManager.mode = ViewManagerMode.selecting;

                    switch (viewport) {
                        case "zoomout":
                            css("viewport-zoomout");
                            viewManager.mode = ViewManagerMode.pause;
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
                })

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
                        routeHandler.navigateTo(htmlLinkElement.href);
                    }
                };

                const onPointerMove = (event) => {
                    const elements = Utils.elementsFromPoint(element.ownerDocument, event.clientX, event.clientY);

                    if (elements.some(el => el.classList.contains("toolbox") || el.classList.contains("editor"))) {
                        hostElement.classList.add("no-pointer-events");
                    }
                    else {
                        hostElement.classList.remove("no-pointer-events");
                    }
                }

                const onLoad = () => {
                    globalEventHandler.appendDocument(hostElement.contentDocument);

                    const documentElement = document.createElement("paperbits-document");
                    documentElement.setAttribute("class", "fit");
                    hostElement.contentDocument.body.appendChild(documentElement);
                    hostElement.contentDocument.addEventListener("click", onClick, true);
                    hostElement.contentDocument.addEventListener("mousedown", onPointerDown, true);

                    ko.applyBindings({}, documentElement);
                }

                hostElement.addEventListener("load", onLoad, false);
                document.addEventListener("mousemove", onPointerMove, true);

                element.appendChild(hostElement);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    hostElement.removeEventListener("load", onLoad, false);
                    document.removeEventListener("mousemove", onPointerMove);
                    hostElement.contentDocument.removeEventListener("click", onClick, true);
                });
            }
        }
    }
}