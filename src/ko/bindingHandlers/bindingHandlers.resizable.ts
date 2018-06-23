import * as ko from "knockout";
import { IEventManager } from "@paperbits/common/events";
import { isNumber } from "util";

interface ResizableOptions {
    /**
     * Allowed values: "none", "vertically", "horizontally".
     */
    directions: string;
    onresize: () => void;
}

export class ResizableBindingHandler {
    constructor(eventManager: IEventManager) {
        ko.bindingHandlers.resizable = {
            init: (element: HTMLElement, valueAccessor: () => string | ResizableOptions) => {
                const options = valueAccessor();

                let directions;
                let onResizeCallback;

                const setOptions = (updatedOptions: string | ResizableOptions) => {
                    if (typeof updatedOptions === "string") {
                        directions = updatedOptions;
                    }
                    else {
                        directions = updatedOptions.directions;
                        onResizeCallback = updatedOptions.onresize;
                    }

                    if (directions.contains("suspended")) {
                        element.classList.add("resize-suspended");

                        element.style.width = null;
                        element.style.height = null;
                    }
                    else {
                        element.classList.remove("resize-suspended");
                    }
                }

                setOptions(ko.unwrap(options));

                if (ko.isObservable(options)) {
                    options.subscribe(setOptions);
                }

                let resizing = false;
                let initialOffsetX, initialOffsetY, initialWidth, initialHeight, initialEdge;

                const style = window.getComputedStyle(element);
                const minWidth = style.minWidth;
                const minHeight = style.minHeight;

                const onPointerDown = (event: MouseEvent, edge: string): void => {
                    if (directions == "none") {
                        return;
                    }

                    const rect = element.getBoundingClientRect();

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    eventManager.addEventListener("onPointerMove", onPointerMove);
                    eventManager.addEventListener("onPointerUp", onPointerUp);

                    resizing = true;

                    initialEdge = edge;
                    initialOffsetX = event.clientX;
                    initialOffsetY = event.clientY;
                    initialWidth = rect.width;
                    initialHeight = rect.height;
                }

                const onPointerUp = (event: MouseEvent): void => {
                    resizing = false;
                    eventManager.removeEventListener("onPointerMove", onPointerMove);
                    eventManager.removeEventListener("onPointerUp", onPointerUp);

                    if (onResizeCallback) {
                        onResizeCallback();
                    }
                }

                const onPointerMove = (event: MouseEvent): void => {
                    if (!resizing) {
                        return;
                    }

                    let width, height, left, top;

                    switch (initialEdge) {
                        case "left":
                            left = event.clientX + "px";
                            width = (initialWidth + (initialOffsetX - event.clientX)) + "px";
                            break;

                        case "right":
                            width = (initialWidth + event.clientX - initialOffsetX) + "px";
                            break;

                        case "top":
                            top = event.clientY + "px";
                            height = (initialHeight + (initialOffsetY - event.clientY)) + "px";
                            break;

                        case "bottom":
                            height = (initialHeight + event.clientY - initialOffsetY) + "px";
                            break;
                    }

                    if (isNumber(minWidth) && width < minWidth) {
                        width = minWidth;
                    }
                    else {
                        element.style.left = left;
                        element.style.width = width;
                        element.classList.add("resized-horizontally");
                    }

                    if (isNumber(minHeight) && height < minHeight) {
                        height = minHeight;
                    }
                    else {
                        element.style.top = top;
                        element.style.height = height;
                        element.classList.add("resized-vertically");
                    }
                }

                if (directions.contains("vertically")) {
                    const topResizeHandle = element.ownerDocument.createElement("div");
                    topResizeHandle.classList.add("resize-handle", "resize-handle-top");
                    element.appendChild(topResizeHandle);
                    topResizeHandle.addEventListener("mousedown", (e) => onPointerDown(e, "top"))

                    const bottomResizeHandle = element.ownerDocument.createElement("div");
                    bottomResizeHandle.classList.add("resize-handle", "resize-handle-bottom");
                    element.appendChild(bottomResizeHandle);
                    bottomResizeHandle.addEventListener("mousedown", (e) => onPointerDown(e, "bottom"));
                }

                if (directions.contains("horizontally")) {
                    const rightResizeHandle = element.ownerDocument.createElement("div");
                    rightResizeHandle.classList.add("resize-handle", "resize-handle-right");
                    element.appendChild(rightResizeHandle);
                    rightResizeHandle.addEventListener("mousedown", (e) => onPointerDown(e, "right"));

                    const leftResizeHandle = element.ownerDocument.createElement("div");
                    leftResizeHandle.classList.add("resize-handle", "resize-handle-left");
                    element.appendChild(leftResizeHandle);
                    leftResizeHandle.addEventListener("mousedown", (e) => onPointerDown(e, "left"));
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    eventManager.removeEventListener("onPointerMove", onPointerMove);
                    eventManager.removeEventListener("onPointerUp", onPointerUp);
                });
            }
        }
    }
}
