import { Keys } from "@paperbits/common";
import * as Arrays from "@paperbits/common/arrays";
import { Events } from "@paperbits/common/events";
import { AriaAttributes } from "@paperbits/common/html";

const toggleAtributeName = "data-toggle";
const targetAttributeName = "data-target";
const dismissAttributeName = "data-dismiss";
const showClassName = "show";
const popupContainerClass = ".popup-container";
const onPopupRepositionRequestedEvent = "onPopupRepositionRequested";
const onPopupRequestedEvent = "onPopupRequested";



interface ToggleableHandle {
    close(): void;
}

const openTogglable = (toggleElement: HTMLElement, toggleType: string, toggleMethod: string): void => {
    switch (toggleType) {
        case "popup":
            const targetSelector = toggleElement.getAttribute(targetAttributeName);

            if (!targetSelector) {
                return;
            }

            const targetElement = <HTMLElement>document.querySelector(targetSelector);

            if (!targetElement) {
                return;
            }

            onShowPopup(toggleElement, targetElement, toggleMethod);
            break;

        case "dropdown": {
            const targetElement = <HTMLElement>toggleElement.parentElement.querySelector(".dropdown");
            onShowTogglable(toggleElement, targetElement);
            break;
        }

        case "collapsible": {
            const targetElement = <HTMLElement>toggleElement.closest(".collapsible-panel");
            onShowTogglable(toggleElement, targetElement);
            break;
        }

        default:
            console.warn(`Unknown data-toggle value ${toggleType}`);
    }
};

const onClick = (event: MouseEvent): void => {
    if (event.button !== 0) {
        return;
    }

    const clickedElement = <HTMLElement>event.target;
    const toggleElement = <HTMLElement>clickedElement.closest(`[${toggleAtributeName}]`);

    if (!toggleElement) {
        return;
    }

    event.preventDefault();

    const toggleType = toggleElement.getAttribute(toggleAtributeName);
    openTogglable(toggleElement, toggleType, "click");
};

const onMouseEnter = (event: MouseEvent): void => {
    const clickedElement = <HTMLElement>event.target;
    const toggleElement = <HTMLElement>clickedElement.closest(`[${toggleAtributeName}]`);

    if (!toggleElement) {
        return;
    }

    event.preventDefault();

    const toggleType = toggleElement.getAttribute(toggleAtributeName);
    openTogglable(toggleElement, toggleType, "hover");
};

const onMouseLeave = (event: MouseEvent): void => {
    ///
};

const onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode !== Keys.Enter && event.keyCode !== Keys.Space) {
        return;
    }
};

const onShowTogglable = (toggleElement: HTMLElement, targetElement: HTMLElement): ToggleableHandle => {
    if (!toggleElement || !targetElement) {
        return;
    }

    const dismissElement = targetElement.querySelector(`[${dismissAttributeName}]`);

    const openTarget = (): void => {
        targetElement.classList.add(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "true");

        setImmediate(() => addEventListener("mousedown", clickOutside));

        if (dismissElement) {
            dismissElement.addEventListener("mousedown", closeTarget);
        }
    };

    const closeTarget = (): void => {
        targetElement.classList.remove(showClassName);
        removeEventListener("mousedown", clickOutside);
        toggleElement.setAttribute(AriaAttributes.expanded, "false");

        if (dismissElement) {
            dismissElement.removeEventListener("mousedown", clickOutside);
        }
    };

    const clickOutside = (event: MouseEvent) => {
        const clickTarget = <HTMLElement>event.target;

        if (clickTarget.nodeName === "BODY") {
            return;
        }

        const isTargetClicked = targetElement.contains(clickTarget);

        if (isTargetClicked) {
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

const onShowPopup = (toggleElement: HTMLElement, targetElement: HTMLElement, toggleMethod: string): ToggleableHandle => {
    if (!toggleElement || !targetElement) {
        return;
    }

    const isTargetOpen = (): boolean => {
        return targetElement.classList.contains(showClassName);
    };

    if (isTargetOpen()) {
        return;
    }

    const popupContainerElement: HTMLElement = targetElement.querySelector(popupContainerClass);

    const repositionPopup = (event?: CustomEvent): void => {
        const computedStyles = getComputedStyle(popupContainerElement);

        if (computedStyles.position === "absolute") {
            const actualToggleElement: HTMLElement = event?.detail?.element || toggleElement;
            const toggleElementRect = actualToggleElement.getBoundingClientRect();
            const popupContainerElement: HTMLElement = targetElement.querySelector(popupContainerClass);
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

    const dismissElements: HTMLElement[] = Arrays.coerce(targetElement.querySelectorAll(`[${dismissAttributeName}]`));


    const chechOutsideClick = (event: MouseEvent) => {
        const eventTarget = <HTMLElement>event.target;

        if (eventTarget.nodeName === "BODY") {
            return;
        }

        const isTargetClicked = popupContainerElement.contains(eventTarget);

        if (isTargetClicked) {
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
        console.log("Close");

        for (const dismissElement of dismissElements) {
            dismissElement.removeEventListener(Events.MouseDown, closeTarget);
        }

        switch (toggleMethod) {
            case "click":
                targetElement.ownerDocument.removeEventListener(Events.MouseDown, chechOutsideClick);
                break;

            case "hover":
                targetElement.ownerDocument.removeEventListener(Events.MouseMove, checkOutsideMove);
                break;
        }

        targetElement.classList.remove(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "false");

        // Temporary hack to reposition popup:
        document.removeEventListener(onPopupRepositionRequestedEvent, repositionPopup);
    };

    const openTarget = (): void => {
        console.log("Open");

        for (const dismissElement of dismissElements) {
            dismissElement.addEventListener(Events.MouseDown, closeTarget);
        }

        targetElement.classList.add(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "true");

        setImmediate(() => {
            switch (toggleMethod) {
                case "click":
                    targetElement.ownerDocument.addEventListener(Events.MouseDown, chechOutsideClick);
                    break;

                case "hover":
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

    onShowPopup(triggerElement, targetElement, "click");
};

// addEventListener("mousedown", onClick, true);
// addEventListener("keydown", onKeyDown, true);
document.documentElement.addEventListener("mouseenter", onMouseEnter, true);
document.documentElement.addEventListener("mouseleave", onMouseLeave, true);
document.addEventListener(onPopupRequestedEvent, onPopupRequest);