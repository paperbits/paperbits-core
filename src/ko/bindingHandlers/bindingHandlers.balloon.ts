import * as ko from "knockout";
import * as Html from "@paperbits/common/html";
import { Keys } from "@paperbits/common/keyboard";
import { View } from "@paperbits/common/ui";
import { BalloonOptions, BalloonActivationMethod, BalloonHandle, BalloonState } from "@paperbits/common/ui/balloons";
import { ViewStack } from "@paperbits/common/ui/viewStack";
import { Events } from "@paperbits/common/events";

const balloonHandlesProp = "balloonHandles";
const activeBalloonProp = "activeBalloon";
const balloonTopClass = "balloon-top";
const balloonBottomClass = "balloon-bottom";
const balloonLeftClass = "balloon-left";
const balloonRightClass = "balloon-right";

const balloonClass = "balloon";
const activeBalloonClass = "balloon-is-active";
const balloonTipClass = "balloon-tip";

enum Position {
    left = "left",
    right = "right",
    top = "top",
    bottom = "bottom"
}

enum Direction {
    vertical = "vertical",
    horizontal = "horizontal",
}

export class BalloonBindingHandler {
    constructor(viewStack: ViewStack) {
        ko.bindingHandlers["balloon"] = {
            init: (toggleElement: HTMLElement, valueAccessor: () => BalloonOptions) => {
                const options = ko.unwrap(valueAccessor());
                const activateOn = options.activateOn || BalloonActivationMethod.clickOrKeyDown;
                const balloonHandles: BalloonHandle[] = toggleElement[balloonHandlesProp] || [];

                if (!toggleElement[balloonHandlesProp]) {
                    toggleElement[balloonHandlesProp] = balloonHandles;
                }

                let inBalloon = false;
                let isHoverOver = false;
                let balloonView: View;
                let balloonElement: HTMLElement;
                let balloonTipElement: HTMLElement;
                let closeTimeout;
                let createBalloonElement: () => void;

                if (options.component) {
                    createBalloonElement = () => {
                        balloonElement = document.createElement("div");
                        balloonElement.classList.add(balloonClass);
                        ko.applyBindingsToNode(balloonElement, { component: options.component, dialog: {} }, null);
                        document.body.appendChild(balloonElement);
                    };
                }

                if (options.template) {
                    createBalloonElement = () => {
                        balloonElement = document.createElement("div");
                        balloonElement.classList.add(balloonClass);
                        ko.applyBindingsToNode(balloonElement, { template: options.template, dialog: {} }, null);
                        document.body.appendChild(balloonElement);
                    };
                }

                if (activateOn === BalloonActivationMethod.clickOrKeyDown) {
                    toggleElement.setAttribute(Html.AriaAttributes.expanded, "false");
                }

                const createBalloonTip = (): void => {
                    balloonTipElement = document.createElement("div");
                    balloonTipElement.classList.add(balloonTipClass);
                    document.body.appendChild(balloonTipElement);
                };

                const removeBalloon = (): void => {
                    balloonHandle.balloonState = BalloonState.closed;

                    if (!balloonElement) {
                        return;
                    }

                    delete toggleElement[activeBalloonProp];
                    ko.cleanNode(balloonElement);
                    balloonElement.remove();
                    balloonElement = null;
                    balloonTipElement.remove();
                    balloonTipElement = null;

                    viewStack.removeView(balloonView);
                };

                const resetCloseTimeout = () => {
                    if (options.closeTimeout) {
                        clearTimeout(closeTimeout);
                        balloonHandle.balloonState = BalloonState.closing;
                        closeTimeout = setTimeout(closeBalloon, options.closeTimeout);
                    }
                };

                const updatePosition = async (): Promise<void> => {
                    if (!balloonElement || !BalloonState.open) {
                        return;
                    }

                    const preferredPosition = options.position;
                    const preferredDirection = preferredPosition === Position.left || preferredPosition === Position.right
                        ? Direction.horizontal
                        : Direction.vertical;

                    const triggerRect = toggleElement.getBoundingClientRect();
                    const balloonRect = balloonElement.getBoundingClientRect();
                    const spaceTop = triggerRect.top;
                    const spaceBottom = window.innerHeight - triggerRect.bottom;
                    const spaceLeft = triggerRect.left;
                    const spaceRight = window.innerWidth - triggerRect.height;

                    const balloonTipSize = 10;
                    const egdeGap = 10;
                    const padding = 10;

                    let balloonLeft: number;
                    let balloonRight: number;
                    let balloonTop: number;
                    let balloonBottom: number;
                    let selectedPosition: string;

                    let positionX: string;
                    let positionY: string;
                    let availableSpaceX: number;
                    let availableSpaceY: number;
                    let balloonHeight: number = balloonRect.height;
                    let balloonWidth: number = balloonRect.width;

                    let balloonTipX: number;
                    let balloonTipY: number;

                    if (preferredDirection === Direction.vertical) {
                        if (spaceTop > spaceBottom) {
                            positionY = Position.top;
                            availableSpaceY = spaceTop - egdeGap - padding;
                        }
                        else {
                            positionY = Position.bottom;
                            availableSpaceY = spaceBottom - egdeGap - padding;
                        }
                    }
                    else {
                        if (spaceLeft > spaceRight) {
                            positionX = Position.left;
                            availableSpaceX = spaceLeft - egdeGap;
                        }
                        else {
                            positionX = Position.right;
                            availableSpaceX = spaceRight - egdeGap;
                        }
                    }

                    if (balloonRect.height > availableSpaceY) {
                        balloonHeight = availableSpaceY;
                    }

                    if (balloonRect.width > availableSpaceX) {
                        balloonWidth = availableSpaceX;
                    }

                    switch (positionY) {
                        case Position.top:
                            balloonTop = triggerRect.top;

                            if ((balloonTop - balloonHeight) < 0) {
                                positionY = Position.bottom;
                            }
                            break;

                        case Position.bottom:
                            balloonTop = triggerRect.top + triggerRect.height;

                            if (balloonTop + balloonHeight > window.innerHeight) {
                                positionY = Position.top;
                            }
                            break;
                    }

                    switch (positionX) {
                        case Position.left:
                            balloonLeft = triggerRect.left;

                            if ((balloonLeft - balloonWidth) < 0) {
                                positionX = Position.right;
                            }
                            break;

                        case Position.right:
                            balloonLeft = triggerRect.left + triggerRect.width;

                            if (balloonLeft + balloonWidth > window.innerWidth) {
                                positionX = Position.left;
                            }
                            break;
                    }

                    balloonTipElement.classList.remove(balloonTopClass);
                    balloonTipElement.classList.remove(balloonBottomClass);
                    balloonTipElement.classList.remove(balloonLeftClass);
                    balloonTipElement.classList.remove(balloonRightClass);

                    if (preferredDirection === Direction.vertical) {
                        switch (positionY) {
                            case Position.top:
                                balloonTop = triggerRect.top - balloonHeight - padding;
                                balloonLeft = triggerRect.left + Math.floor(triggerRect.width / 2) - Math.floor(balloonWidth / 2);
                                balloonTipX = triggerRect.left + Math.floor(triggerRect.width / 2) - Math.floor(balloonTipSize / 2);
                                balloonTipY = triggerRect.top - Math.floor(balloonTipSize / 2) - padding;
                                balloonTipElement.classList.add(balloonTopClass);
                                selectedPosition = Position.top;
                                break;

                            case Position.bottom:
                                balloonTop = triggerRect.top + triggerRect.height + padding;
                                balloonLeft = triggerRect.left + Math.floor(triggerRect.width / 2) - Math.floor(balloonWidth / 2);
                                balloonTipX = triggerRect.left + Math.floor(triggerRect.width / 2) - Math.floor(balloonTipSize / 2);
                                balloonTipY = triggerRect.bottom - Math.floor(balloonTipSize / 2) + padding;
                                balloonTipElement.classList.add(balloonBottomClass);
                                selectedPosition = Position.bottom;
                                break;
                        }
                    }
                    else {
                        switch (positionX) {
                            case Position.left:
                                balloonTop = triggerRect.top + Math.floor(triggerRect.height / 2) - Math.floor(balloonHeight / 2);
                                balloonLeft = triggerRect.left - balloonWidth - padding;
                                balloonTipX = triggerRect.left - Math.floor(balloonTipSize / 2) - padding;
                                balloonTipY = triggerRect.top + Math.floor(triggerRect.height / 2) - Math.floor(balloonTipSize / 2);
                                balloonTipElement.classList.add(balloonLeftClass);
                                selectedPosition = Position.left;
                                break;

                            case Position.right:
                                balloonTop = triggerRect.top + Math.floor(triggerRect.height / 2) - Math.floor(balloonHeight / 2);
                                balloonLeft = triggerRect.right + padding;
                                balloonTipX = triggerRect.right - Math.floor(balloonTipSize / 2) + padding;
                                balloonTipY = triggerRect.top + Math.floor(triggerRect.height / 2) - Math.floor(balloonTipSize / 2);
                                balloonTipElement.classList.add(balloonRightClass);
                                selectedPosition = Position.right;
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

                    delete balloonElement.style.top;
                    delete balloonElement.style.bottom;
                    delete balloonElement.style.left;
                    delete balloonElement.style.right;

                    if (balloonTop + balloonHeight > window.innerHeight) {
                        const overflowCorrection = (balloonTop + balloonHeight) - window.innerHeight;
                        balloonTop = balloonTop - overflowCorrection;
                    }

                    switch (selectedPosition) {
                        case Position.top:
                            balloonElement.style.bottom = `${balloonBottom}px`;
                            balloonElement.style.left = `${balloonLeft}px`;
                            break;

                        case Position.bottom:
                            balloonElement.style.top = `${balloonTop}px`;
                            balloonElement.style.left = `${balloonLeft}px`;
                            break;

                        case Position.left:
                            balloonElement.style.top = `${balloonTop}px`;
                            balloonElement.style.height = `${balloonHeight}px`;
                            // balloonElement.style.right = `${balloonRight}px`; // TODO: Make it work
                            balloonElement.style.left = `${balloonLeft}px`;
                            break;

                        case Position.right:
                            balloonElement.style.top = `${balloonTop}px`;
                            balloonElement.style.height = `${balloonHeight}px`;
                            balloonElement.style.left = `${balloonLeft}px`;
                            break;
                    }

                    balloonElement.style.maxHeight = availableSpaceY + "px";
                    balloonElement.style.maxWidth = availableSpaceX + "px";

                    balloonTipElement.style.top = `${balloonTipY}px`;
                    balloonTipElement.style.left = `${balloonTipX}px`;
                };

                const openBalloon = (returnFocusTo?: HTMLElement): void => {
                    if (options.isDisabled && options.isDisabled()) {
                        return;
                    }

                    resetCloseTimeout();

                    const existingBalloonHandle: BalloonHandle = toggleElement[activeBalloonProp];

                    if (existingBalloonHandle) {
                        if (existingBalloonHandle.balloonState == BalloonState.opening || existingBalloonHandle.balloonState == BalloonState.open) {
                            return;
                        }

                        if (existingBalloonHandle.activateOn === BalloonActivationMethod.hoverOrFocus) {
                            existingBalloonHandle.close();
                        }
                        else {
                            return;
                        }
                    }

                    setImmediate(() => { // give chance to view stack to clear unrelated views
                        if (!document.contains(toggleElement)) {
                            return;
                        }

                        const activeBalloonHandle: BalloonHandle = toggleElement[activeBalloonProp];

                        if (activeBalloonHandle) {
                            if (activateOn === BalloonActivationMethod.hoverOrFocus) {
                                return;
                            }
                            else {
                                activeBalloonHandle.close();
                            }
                        }

                        createBalloonElement();
                        createBalloonTip();

                        balloonView = {
                            close: closeBalloon,
                            element: balloonElement,
                            returnFocusTo: returnFocusTo,
                            hitTest: (targetElement) => {
                                const element =
                                    Html.closest(targetElement, x => x === balloonElement) ||
                                    Html.closest(targetElement, x => x === toggleElement);

                                return !!element;
                            }
                        };

                        viewStack.runHitTest(toggleElement);
                        viewStack.pushView(balloonView);

                        if (activateOn === BalloonActivationMethod.clickOrKeyDown) {
                            toggleElement.setAttribute(Html.AriaAttributes.expanded, "true");
                        }

                        toggleElement[activeBalloonProp] = balloonHandle;

                        balloonElement.classList.add(activeBalloonClass);
                        requestAnimationFrame(updatePosition);
                        balloonHandle.balloonState = BalloonState.open;

                        if (options.onOpen) {
                            options.onOpen();
                        }

                        if (activateOn === BalloonActivationMethod.hoverOrFocus) {
                            balloonElement.addEventListener(Events.MouseEnter, () => {
                                inBalloon = true;
                            });

                            balloonElement.addEventListener(Events.MouseLeave, () => {
                                inBalloon = false;
                                checkCloseHoverBalloon();
                            });
                        }
                    });
                };

                const closeBalloon = (): void => {
                    if (!balloonElement) {
                        return;
                    }

                    if (options.onClose) {
                        options.onClose();
                    }

                    removeBalloon();

                    if (activateOn === BalloonActivationMethod.clickOrKeyDown) {
                        toggleElement.setAttribute(Html.AriaAttributes.expanded, "false");
                    }
                };

                const toggle = (): void => {
                    resetCloseTimeout();

                    const existingBalloonHandle: BalloonHandle = toggleElement[activeBalloonProp];

                    if (existingBalloonHandle && balloonHandle !== existingBalloonHandle) {
                        existingBalloonHandle.close();
                    }

                    if (balloonHandle.balloonState === BalloonState.open) {
                        if (!options.closeTimeout) {
                            balloonHandle.balloonState = BalloonState.closing;
                            closeBalloon();
                        }
                    }
                    else {
                        balloonHandle.balloonState = BalloonState.opening;
                        openBalloon(toggleElement);
                    }
                };

                const balloonHandle: BalloonHandle = {
                    open: openBalloon,
                    close: closeBalloon,
                    toggle: toggle,
                    updatePosition: () => requestAnimationFrame(updatePosition),
                    activateOn: activateOn,
                    balloonState: BalloonState.closed
                };

                if (balloonHandles.some(x => x.activateOn === activateOn)) {
                    throw new Error(`The element already has balloon with activation method "${activateOn}".`);
                }

                balloonHandles.push(balloonHandle);

                if (options.onCreated) {
                    options.onCreated(balloonHandle);
                }

                const getBaloonHandleFor = (...methods: BalloonActivationMethod[]): BalloonHandle => {
                    const balloonHandles: BalloonHandle[] = toggleElement[balloonHandlesProp];

                    const handle = methods.map(x => balloonHandles.find(y => y.activateOn === x)).find(x => !!x);
                    return handle;
                };

                const onPointerDown = async (event: MouseEvent): Promise<void> => {
                    if (!toggleElement) {
                        return;
                    }

                    const targetElement = <HTMLElement>event.target;
                    const element = Html.closest(targetElement, (node) => node === toggleElement);

                    if (!element) {
                        return;
                    }

                    const handle = getBaloonHandleFor(BalloonActivationMethod.clickOrKeyDown);

                    if (handle) {
                        handle.toggle();
                    }
                };

                const onFocus = (): void => {
                    const existingBalloonHandle: BalloonHandle = toggleElement[activeBalloonProp];

                    if (existingBalloonHandle) {
                        return;
                    }

                    openBalloon();
                };

                const onBlur = (): void => {
                    closeBalloon();
                };

                const onMouseEnter = (event: MouseEvent): void => {
                    const handle = getBaloonHandleFor(BalloonActivationMethod.hoverOrFocus, BalloonActivationMethod.all);

                    if (!handle) {
                        return;
                    }

                    isHoverOver = true;

                    balloonHandle.balloonState = BalloonState.opening;

                    setTimeout(() => {
                        if (!isHoverOver) {
                            return;
                        }

                        openBalloon();
                    }, options.delay || 0);
                };

                const onMouseLeave = (event: MouseEvent): void => {
                    isHoverOver = false;
                    checkCloseHoverBalloon();
                };

                const checkCloseHoverBalloon = (): void => {
                    setTimeout(() => {
                        if (!isHoverOver && !inBalloon) {
                            balloonHandle.balloonState = BalloonState.closing;
                            closeBalloon();
                        }
                    }, 50);
                };

                const onKeyDown = (event: KeyboardEvent): void => {
                    switch (event.key) {
                        case Keys.Enter:
                        case Keys.Space:
                            event.preventDefault();

                            const handle = getBaloonHandleFor(BalloonActivationMethod.clickOrKeyDown, BalloonActivationMethod.all);

                            if (handle) {
                                handle.toggle();
                            }

                            break;
                    }
                };

                const onClick = (event: MouseEvent): void => {
                    event.preventDefault();
                };

                const onScroll = async (event: MouseEvent): Promise<void> => {
                    if (!balloonElement) {
                        return;
                    }

                    requestAnimationFrame(updatePosition);
                };

                if (options.closeOn) {
                    options.closeOn.subscribe(() => closeBalloon());
                }

                toggleElement.addEventListener(Events.Click, onClick);
                window.addEventListener(Events.Scroll, onScroll, true);

                switch (activateOn) {
                    case BalloonActivationMethod.clickOrKeyDown:
                        toggleElement.addEventListener(Events.KeyDown, onKeyDown);
                        document.addEventListener(Events.MouseDown, onPointerDown, true);
                        break;

                    case BalloonActivationMethod.hoverOrFocus:
                        toggleElement.addEventListener(Events.MouseEnter, onMouseEnter);
                        toggleElement.addEventListener(Events.MouseLeave, onMouseLeave);
                        toggleElement.addEventListener(Events.Focus, onFocus);
                        toggleElement.addEventListener(Events.Blur, onBlur);

                        break;

                    case BalloonActivationMethod.all:
                        toggleElement.addEventListener(Events.KeyDown, onKeyDown);
                        toggleElement.addEventListener(Events.MouseEnter, onMouseEnter);
                        toggleElement.addEventListener(Events.MouseLeave, onMouseLeave);
                        // toggleElement.addEventListener(Events.Focus, onFocus);
                        // toggleElement.addEventListener(Events.Blur, onBlur);
                        break;

                    default:
                        throw new Error(`Unknown balloon trigger event: ${activateOn}`);
                }

                ko.utils.domNodeDisposal.addDisposeCallback(toggleElement, () => {
                    balloonHandle.balloonState = BalloonState.closing;
                    window.removeEventListener(Events.MouseDown, onPointerDown, true);
                    toggleElement.removeEventListener(Events.Click, onClick);

                    switch (activateOn) {
                        case BalloonActivationMethod.clickOrKeyDown:
                            toggleElement.removeEventListener(Events.KeyDown, onKeyDown);
                            break;

                        case BalloonActivationMethod.hoverOrFocus:
                            toggleElement.removeEventListener(Events.MouseEnter, onMouseEnter);
                            toggleElement.removeEventListener(Events.MouseLeave, onMouseLeave);
                            break;

                        case BalloonActivationMethod.all:
                            toggleElement.removeEventListener(Events.KeyDown, onKeyDown);
                            toggleElement.removeEventListener(Events.MouseEnter, onMouseEnter);
                            toggleElement.removeEventListener(Events.MouseLeave, onMouseLeave);
                            break;

                        default:
                            throw new Error(`Unknown balloon trigger event: ${activateOn}`);
                    }

                    removeBalloon();
                    window.removeEventListener(Events.Scroll, onScroll, true);
                });
            }
        };
    }
}