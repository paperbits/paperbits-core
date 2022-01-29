import * as Arrays from "@paperbits/common/arrays";
import { Keys } from "@paperbits/common/keyboard";
import { Events, MouseButton } from "@paperbits/common/events";
import { AriaAttributes, DataAttributes } from "@paperbits/common/html";
import { TriggerEvent } from "./triggerEvent";
import { ToggleType } from "./toggleType";


const showClassName = "show";
const popupContainerClass = "popup-container";
const onPopupRepositionRequestedEvent = "onPopupRepositionRequested";
const onPopupRequestedEvent = "onPopupRequested";


interface ToggleableHandle {
    close(): void;
}

const openTogglable = (toggleElement: HTMLElement, toggleType: ToggleType, triggerEvent: TriggerEvent): void => {
    switch (toggleType) {
        case ToggleType.popup:
            const targetSelector = toggleElement.getAttribute(DataAttributes.Target);

            if (!targetSelector) {
                return;
            }

            const targetElement = <HTMLElement>document.querySelector(targetSelector);

            if (!targetElement) {
                return;
            }

            onShowPopup(toggleElement, targetElement, triggerEvent);
            break;

        case ToggleType.dropdown: {
            const targetElement = <HTMLElement>toggleElement.parentElement.querySelector(".dropdown");
            onShowTogglable(toggleElement, targetElement);
            break;
        }

        case ToggleType.collapsible: {
            const targetElement = <HTMLElement>toggleElement.closest(".collapsible-panel");
            onShowTogglable(toggleElement, targetElement);
            break;
        }

        default:
            console.warn(`Unknown data-toggle value ${toggleType}`);
    }
};

const onClick = (event: MouseEvent): void => {
    if (event.button !== MouseButton.Main) {
        return;
    }

    const eventTarget = <HTMLElement>event.target;
    const toggleElement = <HTMLElement>eventTarget.closest(`[${DataAttributes.Toggle}]`);

    if (!toggleElement) {
        return;
    }

    event.preventDefault();

    const toggleType = <ToggleType>toggleElement.getAttribute(DataAttributes.Toggle);
    openTogglable(toggleElement, toggleType, TriggerEvent.Click);
};

const onMouseEnter = (event: MouseEvent): void => {
    const eventTarget = <HTMLElement>event.target;
    const toggleElement = <HTMLElement>eventTarget.closest(`[${DataAttributes.Toggle}]`);

    if (!toggleElement) {
        return;
    }

    const triggerEvent = toggleElement.getAttribute(DataAttributes.TriggerEvent);

    if (triggerEvent !== TriggerEvent.Hover) {
        return;
    }

    event.preventDefault();

    const toggleType = <ToggleType>toggleElement.getAttribute(DataAttributes.Toggle);
    openTogglable(toggleElement, toggleType, TriggerEvent.Hover);
};


const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== Keys.Enter && event.key !== Keys.Space) {
        return;
    }
};

const onShowTogglable = (toggleElement: HTMLElement, targetElement: HTMLElement): ToggleableHandle => {
    if (!toggleElement || !targetElement) {
        return;
    }

    const dismissElements: HTMLElement[] = Arrays.coerce(targetElement.querySelectorAll(`[${DataAttributes.Dismiss}]`));

    const openTarget = (): void => {
        targetElement.classList.add(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "true");

        setImmediate(() => addEventListener(Events.MouseDown, clickOutside));

        for (const dismissElement of dismissElements) {
            dismissElement.addEventListener(Events.Click, closeTarget);
        }
    };

    const closeTarget = (): void => {
        targetElement.classList.remove(showClassName);
        removeEventListener(Events.MouseDown, clickOutside);
        toggleElement.setAttribute(AriaAttributes.expanded, "false");

        for (const dismissElement of dismissElements) {
            dismissElement.removeEventListener(Events.Click, closeTarget);
        }
    };

    const clickOutside = (event: MouseEvent) => {
        const clickTarget = <HTMLElement>event.target;

        if (clickTarget.nodeName === "BODY") {
            return;
        }

        const isClickInsideTarget = targetElement.contains(clickTarget);

        if (isClickInsideTarget) {
            return;
        }

        closeTarget();
    };

    if (!targetElement.classList.contains(showClassName)) {
        openTarget();
    }

    const togglableHandle: ToggleableHandle = {
        close: closeTarget
    };

    return togglableHandle;
};

const onShowPopup = (toggleElement: HTMLElement, targetElement: HTMLElement, triggerEvent: TriggerEvent): ToggleableHandle => {
    if (!toggleElement || !targetElement) {
        return;
    }

    const isTargetOpen = (): boolean => {
        return targetElement.classList.contains(showClassName);
    };

    if (isTargetOpen()) {
        return;
    }

    const popupContainerElement: HTMLElement = targetElement.querySelector(`.${popupContainerClass}`);

    const repositionPopup = (event?: CustomEvent): void => {
        const computedStyles = getComputedStyle(popupContainerElement);

        if (computedStyles.position === "absolute") {
            const actualToggleElement: HTMLElement = event?.detail?.element || toggleElement;
            const toggleElementRect = actualToggleElement.getBoundingClientRect();
            const popupContainerElement: HTMLElement = targetElement.querySelector(`.${popupContainerClass}`);
            const popupContainerElementRect = popupContainerElement.getBoundingClientRect();
            const requestedPosition = actualToggleElement.getAttribute("data-position") || "bottom";

            const triggerHalfWidth = Math.floor(toggleElementRect.width / 2);
            const triggerHalfHeight = Math.floor(toggleElementRect.height / 2);
            const popupHalfWidth = Math.floor(popupContainerElementRect.width / 2);
            const popupHalfHeight = Math.floor(popupContainerElementRect.height / 2);

            const position = requestedPosition.split(" ");

            // Default assignments
            popupContainerElement.style.left = toggleElementRect.left + triggerHalfWidth - popupHalfWidth + "px";
            popupContainerElement.style.top = window.scrollY + toggleElementRect.top + triggerHalfHeight - popupHalfHeight + "px";

            if (position.includes("top")) {
                popupContainerElement.style.top = window.scrollY + toggleElementRect.top - popupContainerElementRect.height - triggerHalfHeight + "px";
            }

            if (position.includes("bottom")) {
                popupContainerElement.style.top = window.scrollY + toggleElementRect.bottom + "px";
            }

            if (position.includes("left")) {
                popupContainerElement.style.left = toggleElementRect.left + "px";
            }

            if (position.includes("right")) {
                popupContainerElement.style.left = toggleElementRect.right - popupContainerElementRect.width + "px";
            }

            return;
        }

        popupContainerElement.removeAttribute("style");
    };

    const dismissElements: HTMLElement[] = Arrays.coerce(targetElement.querySelectorAll(`[${DataAttributes.Dismiss}]`));

    const checkOutsideClick = (event: MouseEvent) => {
        const eventTarget = <HTMLElement>event.target;

        if (eventTarget.nodeName === "BODY") {
            return;
        }

        const isTargetClicked = popupContainerElement.contains(eventTarget);

        if (isTargetClicked) {
            return;
        }

        const isToggleClicked = toggleElement.contains(eventTarget);

        if (isToggleClicked) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        closeTarget();
    };

    const checkOutsideMove = (event: MouseEvent) => {
        const eventTarget = <HTMLElement>event.target;

        if (eventTarget.nodeName === "BODY") {
            return;
        }

        const isTargetClicked = popupContainerElement.contains(eventTarget);

        if (isTargetClicked) {
            return;
        }

        const isToggleClicked = toggleElement.contains(eventTarget);

        if (isToggleClicked) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        closeTarget();
    };

    const closeTarget = (): void => {
        for (const dismissElement of dismissElements) {
            dismissElement.removeEventListener(Events.MouseDown, closeTarget);
        }

        switch (triggerEvent) {
            case TriggerEvent.Click:
                targetElement.ownerDocument.removeEventListener(Events.MouseDown, checkOutsideClick);
                break;

            case TriggerEvent.Hover:
                targetElement.ownerDocument.removeEventListener(Events.MouseMove, checkOutsideMove);
                break;
        }

        targetElement.classList.remove(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "false");

        // Temporary hack to reposition popup:
        document.removeEventListener(onPopupRepositionRequestedEvent, repositionPopup);
    };

    const openTarget = (): void => {
        for (const dismissElement of dismissElements) {
            dismissElement.addEventListener(Events.MouseDown, closeTarget);
        }

        targetElement.classList.add(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "true");

        setImmediate(() => {
            switch (triggerEvent) {
                case TriggerEvent.Click:
                    targetElement.ownerDocument.addEventListener(Events.MouseDown, checkOutsideClick);
                    break;

                case TriggerEvent.Hover:
                    targetElement.ownerDocument.addEventListener(Events.MouseMove, checkOutsideMove);
                    break;
            }

            repositionPopup();
        });

        // Temporary hack to reposition popup:
        document.addEventListener(onPopupRepositionRequestedEvent, repositionPopup);
    };

    if (!targetElement.classList.contains(showClassName)) {
        openTarget();
    }

    const togglableHandle: ToggleableHandle = {
        close: closeTarget
    };

    return togglableHandle;
};

const onPopupRequest = (event: CustomEvent): void => {
    const popupKey = event.detail;
    const targetSelector = `#${popupKey.replace("popups/", "popups")}`;
    const targetElement = <HTMLElement>document.querySelector(targetSelector);
    const triggerSelector = `[data-target="${targetSelector}"]`;
    const triggerElement = <HTMLElement>document.querySelector(triggerSelector);

    if (targetElement.classList.contains(showClassName)) {
        return;
    }

    const openTargetElement = document.querySelector(`.${showClassName}`);

    if (openTargetElement) {
        openTargetElement.classList.remove(showClassName);
    }

    onShowPopup(triggerElement, targetElement, TriggerEvent.Click);
};

addEventListener(Events.Click, onClick, true);
addEventListener(Events.KeyDown, onKeyDown, true);
document.documentElement.addEventListener(Events.MouseEnter, onMouseEnter, true);
document.addEventListener(onPopupRequestedEvent, onPopupRequest);