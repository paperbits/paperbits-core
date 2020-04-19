import * as ko from "knockout";
import { EventManager } from "@paperbits/common/events";
import { Keys } from "@paperbits/common/keyboard";
import { IComponent, ITemplate, View } from "@paperbits/common/ui";
import { ViewStack } from "../ui/viewStack";

export interface BalloonOptions {
    position: string;
    selector?: string;
    component?: IComponent;
    template?: ITemplate;
    onCreated?: (handle) => void;
    isOpen: any;
    onOpen?: () => void;
    onClose?: () => void;
    closeOn: ko.Subscribable;
    closeTimeout?: number;
}

export class BalloonBindingHandler {
    constructor(viewStack: ViewStack, eventManager?: EventManager) {
        ko.bindingHandlers["balloon"] = {
            init: (toggleElement: HTMLElement, valueAccessor: () => BalloonOptions) => {
                const options = ko.unwrap(valueAccessor());

                let view: View;
                let balloonElement: HTMLElement;
                let balloonIsOpen = false;
                let closeTimeout;

                let createBalloonElement: () => void;

                if (options.component) {
                    createBalloonElement = () => {
                        balloonElement = document.createElement("div");
                        balloonElement.classList.add("balloon");
                        ko.applyBindingsToNode(balloonElement, { component: options.component }, null);
                        document.body.appendChild(balloonElement);
                    };
                }

                if (options.template) {
                    createBalloonElement = () => {
                        balloonElement = document.createElement("div");
                        balloonElement.classList.add("balloon");
                        ko.applyBindingsToNode(balloonElement, { template: options.template }, null);
                        document.body.appendChild(balloonElement);
                    };
                }

                const resetCloseTimeout = () => {
                    if (options.closeTimeout) {
                        clearTimeout(closeTimeout);
                        closeTimeout = setTimeout(close, options.closeTimeout);
                    }
                };

                const updatePosition = async (): Promise<void> => {
                    if (!balloonElement || !balloonElement) {
                        return;
                    }

                    const preferredPosition = options.position;
                    const preferredDirection = preferredPosition === "left" || preferredPosition === "right"
                        ? "horizontal"
                        : "vertical";

                    const triggerRect = toggleElement.getBoundingClientRect();
                    const balloonRect = balloonElement.getBoundingClientRect();
                    const spaceTop = triggerRect.top;
                    const spaceBottom = window.innerHeight - triggerRect.bottom;
                    const spaceLeft = triggerRect.left;
                    const spaceRight = window.innerWidth - triggerRect.height;

                    const balloonTipShift = 10;
                    const egdeGap = 10;

                    let balloonLeft;
                    let balloonTop;
                    let balloonBottom;

                    let positionX: string;
                    let positionY: string;
                    let availableSpaceX: number;
                    let availableSpaceY: number;
                    let balloonHeight: number = balloonRect.height;
                    let balloonWidth: number = balloonRect.width;

                    if (preferredDirection === "vertical") {
                        if (spaceTop > spaceBottom) {
                            positionY = "top";
                            availableSpaceY = spaceTop - egdeGap;
                        }
                        else {
                            positionY = "bottom";
                            availableSpaceY = spaceBottom - egdeGap;
                        }
                    }
                    else {
                        if (spaceLeft > spaceRight) {
                            positionX = "left";
                            availableSpaceX = spaceLeft - egdeGap;
                        }
                        else {
                            positionX = "right";
                            availableSpaceX = spaceRight - egdeGap;
                        }
                    }


                    balloonElement.style.maxHeight = availableSpaceY + "px";
                    balloonElement.style.maxWidth = availableSpaceX + "px";

                    if (balloonRect.height > availableSpaceY) {
                        balloonHeight = availableSpaceY;
                    }

                    if (balloonRect.width > availableSpaceX) {
                        balloonWidth = availableSpaceX;
                    }

                    switch (positionY) {
                        case "top":
                            balloonTop = triggerRect.top;

                            if ((balloonTop - balloonHeight) < 0) {
                                positionY = "bottom";
                            }
                            break;

                        case "bottom":
                            balloonTop = triggerRect.top + triggerRect.height;

                            if (balloonTop + balloonHeight > window.innerHeight) {
                                positionY = "top";
                            }
                            break;
                    }

                    switch (positionX) {
                        case "left":
                            balloonLeft = triggerRect.left;

                            if ((balloonLeft - balloonWidth) < 0) {
                                positionX = "right";
                            }
                            break;

                        case "right":
                            balloonLeft = triggerRect.left + triggerRect.width;

                            if (balloonLeft + balloonWidth > window.innerWidth) {
                                positionX = "left";
                            }
                            break;
                    }

                    balloonElement.classList.remove("balloon-top");
                    balloonElement.classList.remove("balloon-bottom");
                    balloonElement.classList.remove("balloon-left");
                    balloonElement.classList.remove("balloon-right");

                    if (preferredDirection === "vertical") {
                        switch (positionY) {
                            case "top":
                                balloonElement.classList.add("balloon-top");
                                balloonTop = triggerRect.top - balloonHeight - 5;
                                balloonLeft = triggerRect.left + (triggerRect.width / 2) - (balloonWidth / 2);

                                break;

                            case "bottom":
                                balloonElement.classList.add("balloon-bottom");
                                balloonTop = triggerRect.top + triggerRect.height + 5;
                                balloonLeft = triggerRect.left + (triggerRect.width / 2) - (balloonWidth / 2);
                                break;
                        }
                    }
                    else {
                        switch (positionX) {
                            case "left":
                                balloonElement.classList.add("balloon-left");
                                balloonTop = triggerRect.top + (triggerRect.height / 2) - (balloonHeight / 2) - balloonTipShift;
                                balloonLeft = triggerRect.left - balloonWidth - balloonTipShift;
                                break;

                            case "right":
                                balloonElement.classList.add("balloon-right");
                                balloonTop = triggerRect.top + (triggerRect.height / 2) - (balloonHeight / 2) - balloonTipShift;
                                balloonLeft = triggerRect.right + balloonTipShift;
                                break;
                        }
                    }

                    if (balloonTop < egdeGap) {
                        balloonTop = egdeGap;
                    }

                    if (balloonTop + balloonHeight > innerHeight - egdeGap) {
                        balloonBottom = egdeGap;
                    }
                    else {
                        balloonBottom = innerHeight - (balloonTop + balloonHeight);
                    }

                    if (balloonLeft < egdeGap) {
                        balloonLeft = egdeGap;
                    }

                    balloonElement.style.top = `${balloonTop}px`;
                    balloonElement.style.left = `${balloonLeft}px`;
                    balloonElement.style.bottom = `${balloonBottom}px`;
                };

                const open = (returnFocusTo: HTMLElement): void => {
                    resetCloseTimeout();

                    if (balloonIsOpen) {
                        return;
                    }

                    createBalloonElement();

                    view = {
                        close: close,
                        element: balloonElement,
                        returnFocusTo: returnFocusTo,
                        hitTest: (targetElement) => {
                            const element = closest(targetElement, x => x === balloonElement) || closest(targetElement, x => x === toggleElement);
                            return !!element;
                        }
                    };

                    viewStack.pushView(view);

                    balloonElement.classList.add("balloon-is-active");
                    requestAnimationFrame(updatePosition);

                    balloonIsOpen = true;

                    if (options.onOpen) {
                        options.onOpen();
                    }
                };

                const close = (): void => {
                    if (!balloonElement) {
                        return;
                    }

                    balloonIsOpen = false;

                    if (options.onClose) {
                        options.onClose();
                    }

                    if (balloonElement) {
                        ko.cleanNode(balloonElement);
                        balloonElement.remove();
                        balloonElement = null;

                        viewStack.removeView(view);
                    }

                    if (options.isOpen && options.isOpen()) {
                        // TODO: ViewManager should have stack of open editors, so they need to be closed one by one.
                        options.isOpen(false);
                    }
                };

                const toggle = (): void => {
                    resetCloseTimeout();

                    if (balloonIsOpen) {
                        if (!options.closeTimeout) {
                            close();
                        }
                    }
                    else {
                        open(toggleElement);
                    }
                };

                const ballonHandle = {
                    open: open,
                    close: close,
                    toggle: toggle
                };

                if (options.onCreated) {
                    options.onCreated(ballonHandle);
                }

                const closest = (node: Node, predicate: (node: Node) => boolean): Node => {
                    do {
                        if (predicate(node)) {
                            return node;
                        }
                    }
                    while (node = node && node.parentNode);
                };

                const onPointerDown = async (event: MouseEvent): Promise<void> => {
                    if (!toggleElement) {
                        return;
                    }

                    const targetElement = <HTMLElement>event.target;

                    const element = closest(targetElement, (node) => node === toggleElement);

                    if (element) {
                        event.preventDefault();
                        event.stopPropagation();
                        toggle();
                        return;
                    }
                };

                const onKeyDown = async (event: KeyboardEvent): Promise<void> => {
                    switch (event.keyCode) {
                        case Keys.Enter:
                        case Keys.Space:
                            event.preventDefault();
                            toggle();
                            break;
                    }
                };

                const onClick = (event: MouseEvent): void => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                };

                const onScroll = async (event: MouseEvent): Promise<void> => {
                    if (!balloonElement) {
                        return;
                    }

                    requestAnimationFrame(updatePosition);
                };

                if (options.closeOn) {
                    options.closeOn.subscribe(() => close());
                }

                toggleElement.addEventListener("keydown", onKeyDown);
                toggleElement.addEventListener("click", onClick);
                window.addEventListener("scroll", onScroll, true);

                if (eventManager) {
                    eventManager.addEventListener("onPointerDown", onPointerDown);
                }
                else {
                    document.addEventListener("pointerdown", onPointerDown, true);
                }

                ko.utils.domNodeDisposal.addDisposeCallback(toggleElement, () => {
                    toggleElement.removeEventListener("keydown", onKeyDown);
                    toggleElement.removeEventListener("click", onClick);
                    window.removeEventListener("scroll", onScroll, true);

                    if (balloonElement) {
                        ko.cleanNode(balloonElement);
                        balloonElement.remove();
                        balloonElement = null;
                    }

                    if (eventManager) {
                        eventManager.removeEventListener("onPointerDown", onPointerDown);
                    }
                    else {
                        window.removeEventListener("pointerdown", onPointerDown, true);
                    }
                });
            }
        };
    }
}