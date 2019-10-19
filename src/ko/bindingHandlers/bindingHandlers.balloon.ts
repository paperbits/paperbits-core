import * as ko from "knockout";
import { EventManager } from "@paperbits/common/events";
import { Keys } from "@paperbits/common/keyboard";
import { IComponent, ViewManager } from "@paperbits/common/ui";

export interface BalloonOptions {
    position: string;
    element?: HTMLElement;
    selector?: string;
    component?: IComponent;
    onCreated?: (handle) => void;
    isOpen: any;
    onOpen?: () => void;
    onClose?: () => void;
}

export class BalloonBindingHandler {
    constructor(viewManager: ViewManager, eventManager: EventManager) {
        ko.bindingHandlers["balloon"] = {
            init: (toggleElement: HTMLElement, valueAccessor: () => BalloonOptions) => {
                const options = ko.unwrap(valueAccessor());

                let balloonX;
                let balloonY;
                let balloonElement;
                let balloonIsOpen = false;

                let componentConfig: IComponent;

                if (typeof options.component === "string") {
                    componentConfig = { name: options.component };
                }
                else {
                    componentConfig = options.component;
                }

                componentConfig.oncreate = (model, element) => {
                    balloonElement = element;
                    setTimeout(updatePosition, 100); // Let element chance to render and determine sizes
                };

                const updatePosition = async (): Promise<void> => {
                    const triggerRect = toggleElement.getBoundingClientRect();
                    const targetRect = balloonElement.getBoundingClientRect();

                    let position = options.position || "bottom";

                    switch (position) {
                        case "top":
                            balloonY = triggerRect.top;

                            if ((balloonY - targetRect.height) < 0) {
                                position = "bottom";
                            }
                            break;

                        case "bottom":
                            balloonY = triggerRect.top + triggerRect.height;

                            if (balloonY + targetRect.height > window.innerHeight) {
                                position = "top";
                            }
                            break;
                    }

                    balloonElement.classList.remove("balloon-top");
                    balloonElement.classList.remove("balloon-bottom");

                    switch (position) {
                        case "top":
                            balloonElement.classList.add("balloon-top");
                            balloonY = triggerRect.top - targetRect.height;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - 20;

                            break;

                        case "bottom":
                            balloonElement.classList.add("balloon-bottom");
                            balloonY = triggerRect.top + triggerRect.height;
                            balloonX = triggerRect.left + (triggerRect.width / 2) - 20;
                            break;
                    }

                    balloonElement.style.top = `${balloonY}px`;
                    balloonElement.style.left = `${balloonX}px`;
                };

                const open = (): void => {
                    viewManager.addBalloon(componentConfig);

                    balloonIsOpen = true;

                    if (options.onOpen) {
                        options.onOpen();
                    }
                };

                const close = (): void => {
                    if (!balloonElement) {
                        return;
                    }

                    viewManager.removeBalloon(componentConfig);

                    balloonIsOpen = false;

                    if (options.onClose) {
                        options.onClose();
                    }
                };

                const toggle = (): void => {
                    if (balloonIsOpen) {
                        close();
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

                toggleElement.addEventListener("keydown", onKeyDown);
                toggleElement.addEventListener("click", onClick);
                window.addEventListener("scroll", onScroll, true);
                eventManager.addEventListener("onPointerDown", onPointerDown);

                ko.utils.domNodeDisposal.addDisposeCallback(toggleElement, () => {
                    toggleElement.removeEventListener("keydown", onKeyDown);
                    toggleElement.removeEventListener("click", onClick);
                    window.removeEventListener("scroll", onScroll, true);
                    eventManager.removeEventListener("onPointerDown", onPointerDown);

                    viewManager.removeBalloon(componentConfig);
                });
            }
        };
    }
}