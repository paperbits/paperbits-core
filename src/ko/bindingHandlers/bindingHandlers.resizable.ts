import * as ko from "knockout";
import { EventManager, Events } from "@paperbits/common/events";
import { ResizableOptions } from "@paperbits/common/ui/resizableOptions";
import { isNumber } from "@paperbits/common";

export class ResizableBindingHandler {
    constructor(eventManager: EventManager) {
        ko.bindingHandlers.resizable = {
            init: (element: HTMLElement, valueAccessor: () => string | ResizableOptions) => {
                const options = valueAccessor();

                let directions;
                let onResizeCallback;
                let initialOffsetX, initialOffsetY, initialWidth, initialHeight, initialEdge, initialLeft, initialRight, initialTop, initialBottom;

                const setOptions = (updatedOptions: string | ResizableOptions) => {
                    if (typeof updatedOptions === "string") {
                        directions = updatedOptions;
                    }
                    else {
                        directions = updatedOptions.directions;
                        onResizeCallback = updatedOptions.onresize;

                        initialWidth = updatedOptions.initialWidth;

                        if (initialWidth) {
                            element.style.width = initialWidth + "px";
                        }

                        initialHeight = updatedOptions.initialHeight;

                        if (initialHeight) {
                            element.style.height = initialHeight + "px";
                        }
                    }

                    if (directions.includes("suspended")) {
                        element.classList.add("resize-suspended");

                        element.style.width = null;
                        element.style.height = null;
                    }
                    else {
                        element.classList.remove("resize-suspended");
                    }
                };

                setOptions(ko.unwrap(options));

                if (ko.isObservable(options)) {
                    options.subscribe(setOptions);
                }

                let resizing = false;


                const style = window.getComputedStyle(element);
                const minWidth = style.minWidth;
                const minHeight = style.minHeight;

                const onPointerDown = (event: MouseEvent, edge: string): void => {
                    if (directions === "none") {
                        return;
                    }

                    event.preventDefault();
                    event.stopImmediatePropagation();
                    eventManager.addEventListener("onPointerMove", onPointerMove);
                    eventManager.addEventListener("onPointerUp", onPointerUp);

                    resizing = true;

                    const elementRect = element.getBoundingClientRect();

                    initialEdge = edge;
                    initialOffsetX = event.clientX;
                    initialOffsetY = event.clientY;
                    initialWidth = elementRect.width;
                    initialHeight = elementRect.height;
                    initialLeft = elementRect.left;
                    initialRight = elementRect.right;
                    initialTop = elementRect.top;
                    initialBottom = elementRect.bottom;

                    const bodyWidth = element.ownerDocument.body.clientWidth;
                    const bodyHeight = element.ownerDocument.body.clientHeight;

                    switch (initialEdge) {
                        case "left":
                            element.style.left = "unset";
                            element.style.right = bodyWidth - initialRight + "px";
                            element.style.width = initialWidth + "px";
                            break;

                        case "right":
                            element.style.right = "unset";
                            element.style.left = initialLeft + "px";
                            element.style.width = initialWidth + "px";
                            break;

                        case "top":
                            element.style.top = "unset";
                            element.style.bottom = bodyHeight - initialBottom + "px";
                            element.style.height = initialHeight + "px";
                            break;

                        case "bottom":
                            element.style.bottom = "unset";
                            element.style.top = initialTop + "px";
                            element.style.height = initialHeight + "px";
                            break;
                    }

                    element.style.position = "fixed";
                };

                const onPointerUp = (event: MouseEvent): void => {
                    resizing = false;
                    eventManager.removeEventListener("onPointerMove", onPointerMove);
                    eventManager.removeEventListener("onPointerUp", onPointerUp);

                    if (onResizeCallback) {
                        onResizeCallback();
                    }
                };

                const onPointerMove = (event: MouseEvent): void => {
                    if (!resizing) {
                        return;
                    }

                    let width, height;

                    switch (initialEdge) {
                        case "left":
                            width = (initialWidth + (initialOffsetX - event.clientX)) + "px";

                            if (isNumber(minWidth) && width < minWidth) {
                                width = minWidth;
                            }
                            else {
                                element.style.left = "unset";
                                element.style.width = width;
                                element.classList.add("resized-horizontally");
                            }
                            break;

                        case "right":
                            width = (initialWidth + event.clientX - initialOffsetX) + "px";
                            if (isNumber(minWidth) && width < minWidth) {
                                width = minWidth;
                            }
                            else {
                                element.style.right = "unset";
                                element.style.width = width;
                                element.classList.add("resized-horizontally");
                            }
                            break;

                        case "top":
                            height = (initialHeight + (initialOffsetY - event.clientY)) + "px";

                            if (isNumber(minHeight) && height < minHeight) {
                                height = minHeight;
                            }
                            else {
                                element.style.top = "unset";
                                element.style.height = height;
                                element.classList.add("resized-vertically");
                            }
                            break;

                        case "bottom":
                            height = (initialHeight + event.clientY - initialOffsetY) + "px";
                            if (isNumber(minHeight) && height < minHeight) {
                                height = minHeight;
                            }
                            else {
                                element.style.bottom = "unset";
                                element.style.height = height;
                                element.classList.add("resized-vertically");
                            }
                            break;

                        default:
                            throw new Error(`Unexpected resizing initial edge: "${initialEdge}".`);
                    }

                    eventManager.dispatchEvent("onEditorResize");
                };

                const appendTopHandler = (): void => {
                    const topResizeHandle = element.ownerDocument.createElement("div");
                    topResizeHandle.classList.add("resize-handle", "resize-handle-top");
                    element.appendChild(topResizeHandle);
                    topResizeHandle.addEventListener(Events.MouseDown, (e) => onPointerDown(e, "top"));
                };

                const appendBottomHandler = (): void => {
                    const bottomResizeHandle = element.ownerDocument.createElement("div");
                    bottomResizeHandle.classList.add("resize-handle", "resize-handle-bottom");
                    element.appendChild(bottomResizeHandle);
                    bottomResizeHandle.addEventListener(Events.MouseDown, (e) => onPointerDown(e, "bottom"));
                };

                const appendRightHandler = (): void => {
                    const rightResizeHandle = element.ownerDocument.createElement("div");
                    rightResizeHandle.classList.add("resize-handle", "resize-handle-right");
                    element.appendChild(rightResizeHandle);
                    rightResizeHandle.addEventListener(Events.MouseDown, (e) => onPointerDown(e, "right"));
                };

                const appendLeftHandler = (): void => {
                    const leftResizeHandle = element.ownerDocument.createElement("div");
                    leftResizeHandle.classList.add("resize-handle", "resize-handle-left");
                    element.appendChild(leftResizeHandle);
                    leftResizeHandle.addEventListener(Events.MouseDown, (e) => onPointerDown(e, "left"));
                };

                if (directions.includes("top") || directions.includes("vertically")) {
                    appendTopHandler();
                }

                if (directions.includes("bottom") || directions.includes("vertically")) {
                    appendBottomHandler();
                }

                if (directions.includes("left") || directions.includes("horizontally")) {
                    appendLeftHandler();
                }

                if (directions.includes("right") || directions.includes("horizontally")) {
                    appendRightHandler();
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    eventManager.removeEventListener("onPointerMove", onPointerMove);
                    eventManager.removeEventListener("onPointerUp", onPointerUp);
                });
            }
        };
    }
}
