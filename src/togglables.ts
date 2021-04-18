import { Keys } from "@paperbits/common";
import { AriaAttributes } from "@paperbits/common/html";

const toggleAtributeName = "data-toggle";
const targetAttributeName = "data-target";
const dismissAttributeName = "data-dismiss";
const showClassName = "show";
const popupContainerClass = ".popup-container";
const onPopupRepositionRequestedEvent = "onPopupRepositionRequested";
const onPopupRequestedEvent = "onPopupRequested";


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

            onShowPopup(toggleElement, targetElement);
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

const onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode !== Keys.Enter && event.keyCode !== Keys.Space) {
        return;
    }
};

const onShowTogglable = (toggleElement: HTMLElement, targetElement: HTMLElement): void => {
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
};

const onShowPopup = (toggleElement: HTMLElement, targetElement: HTMLElement): void => {
    if (!toggleElement || !targetElement) {
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
            const position = actualToggleElement.getAttribute("data-position") || "bottom";

            const triggerHalfWidth = Math.floor(toggleElementRect.width / 2);
            const triggerHalfHeight =  Math.floor(toggleElementRect.height / 2);
            const popupHalfWidth = Math.floor(popupContainerElementRect.width / 2);
            const popupHalfHeight = Math.floor(popupContainerElementRect.height / 2);

            switch (position) {
                case "top":
                    popupContainerElement.style.top = window.scrollY + toggleElementRect.top - popupContainerElementRect.height - triggerHalfHeight + "px";
                    popupContainerElement.style.left = toggleElementRect.left + triggerHalfWidth - popupHalfWidth + "px";
                    break;
                case "left":
                    break;
                case "right":
                    break;
                case "bottom":
                    popupContainerElement.style.top = window.scrollY + toggleElementRect.bottom + "px";
                    popupContainerElement.style.left = toggleElementRect.left + triggerHalfWidth - popupHalfWidth + "px";
                    break;
            }

            return;
        }

        popupContainerElement.removeAttribute("style");
    };



    const dismissElement: HTMLElement = targetElement.querySelector(`[${dismissAttributeName}]`);

    const clickOutside = (event: MouseEvent) => {
        const clickTarget = <HTMLElement>event.target;

        if (clickTarget.nodeName === "BODY") {
            return;
        }

        const isTargetClicked = popupContainerElement.contains(clickTarget);

        if (isTargetClicked) {
            return;
        }

        closeTarget();
    };

    const closeTarget = (): void => {
        dismissElement.removeEventListener("mousedown", closeTarget);
        targetElement.ownerDocument.removeEventListener("mousedown", clickOutside);
        targetElement.classList.remove(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "false");

        // Temporary hack to reposition popup:
        document.removeEventListener(onPopupRepositionRequestedEvent, repositionPopup);
    };

    const openTarget = (): void => {
        dismissElement.addEventListener("mousedown", closeTarget);
        targetElement.classList.add(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "true");

        setImmediate(() => {
            targetElement.ownerDocument.addEventListener("mousedown", clickOutside);
            repositionPopup();
        });

        // Temporary hack to reposition popup:
        document.addEventListener(onPopupRepositionRequestedEvent, repositionPopup);
    };

    if (!targetElement.classList.contains(showClassName)) {
        openTarget();
    }
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

    onShowPopup(triggerElement, targetElement);
};

addEventListener("mousedown", onClick, true);
addEventListener("keydown", onKeyDown, true);
document.addEventListener(onPopupRequestedEvent, onPopupRequest);