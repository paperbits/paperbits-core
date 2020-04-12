import * as ko from "knockout";
import { EventManager } from "@paperbits/common/events";
import { Keys } from "@paperbits/common/keyboard";
import { IComponent, ITemplate } from "@paperbits/common/ui";

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
    constructor(eventManager?: EventManager) {
        ko.bindingHandlers["balloon"] = {
            init: (toggleElement: HTMLElement, valueAccessor: () => BalloonOptions) => {
                const options = ko.unwrap(valueAccessor());

                let balloonX;
                let balloonY;
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

                    const triggerRect = toggleElement.getBoundingClientRect();
                    const balloonRect = balloonElement.getBoundingClientRect();
                    const spaceTop = triggerRect.top;
                    const spaceBottom = window.innerHeight - triggerRect.bottom;
                    const balloonTipShift = 20;
                    const egdeGap = 10;

                    let position: string;
                    let availableSpace: number;
                    let balloonHeight: number = balloonRect.height;

                    if (spaceTop > spaceBottom) {
                        position = "top";
                        availableSpace = spaceTop - egdeGap;
                    }
                    else {
                        position = "bottom";
                        availableSpace = spaceBottom - egdeGap;
                    }

                    if (balloonRect.height > availableSpace) {
                        balloonHeight = availableSpace;
                        balloonElement.style.height = availableSpace + "px";
                    }

                    switch (position) {
                        case "top":
                            balloonY = triggerRect.top;

                            if ((balloonY - balloonHeight) < 0) {
                                position = "bottom";
                            }
                            break;

                        case "bottom":
                            balloonY = triggerRect.top + triggerRect.height;

                            if (balloonY + balloonHeight > window.innerHeight) {
                                position = "top";
                            }
                            break;
                    }

                    balloonElement.classList.remove("balloon-top");
                    balloonElement.classList.remove("balloon-bottom");

                    switch (position) {
                        case "top":
                            balloonElement.classList.add("balloon-top");
                            balloonY = triggerRect.top - balloonHeight;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - balloonTipShift;

                            break;

                        case "bottom":
                            balloonElement.classList.add("balloon-bottom");
                            balloonY = triggerRect.top + triggerRect.height;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - balloonTipShift;
                            break;
                    }

                    balloonElement.style.top = `${balloonY}px`;
                    balloonElement.style.left = `${balloonX}px`;
                };

                const open = (): void => {
                    resetCloseTimeout();

                    if (balloonIsOpen) {
                        return;
                    }

                    createBalloonElement();
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
                        open();
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

                    const element = closest(<any>event.target, (node) => node === toggleElement);

                    if (element) {
                        event.preventDefault();
                        event.stopPropagation();
                        toggle();
                        return;
                    }

                    const balloon = closest(<any>event.target, (node) => node === balloonElement);

                    if (!balloon) {
                        close();
                    }
                };

                const onKeyDown = async (event: KeyboardEvent): Promise<void> => {
                    switch (event.keyCode) {
                        case Keys.Enter:
                        case Keys.Space:
                            event.preventDefault();
                            toggle();
                            break;

                        case Keys.Esc:
                            if (options.isOpen && options.isOpen()) {
                                // TODO: ViewManager should have stack of open editors, so they need to be closed one by one.
                                options.isOpen(false);
                            }
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