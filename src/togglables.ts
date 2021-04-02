import { Keys } from "@paperbits/common";
import { AriaAttributes } from "@paperbits/common/html";

const toggleAtributeName = "data-toggle";
const targetAttributeName = "data-target";
const dismissAttributeName = "data-dismiss";
const showClassName = "show";
const popupContainerClass = ".popup-container";
const onPopupRepositionRequestedEvent = "onPopupRepositionRequested";


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

    const closeTarget = () => {
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

    const repositionPopup = () => {
        const computedStyles = getComputedStyle(popupContainerElement);

        if (computedStyles.position === "absolute") {
            const toggleElementRect = toggleElement.getBoundingClientRect();
            const popupContainerElement: HTMLElement = targetElement.querySelector(popupContainerClass);
            popupContainerElement.style.top = window.scrollY + toggleElementRect.bottom + "px";
            popupContainerElement.style.left = toggleElementRect.left + "px";
        }
        else {
            popupContainerElement.removeAttribute("style");
        }
    };

    repositionPopup();

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

    const closeTarget = () => {
        dismissElement.removeEventListener("mousedown", closeTarget);
        targetElement.ownerDocument.removeEventListener("mousedown", clickOutside);
        targetElement.classList.remove(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "false");

        removeEventListener(onPopupRepositionRequestedEvent, repositionPopup);
    };

    const openTarget = (): void => {
        dismissElement.addEventListener("mousedown", closeTarget);
        targetElement.classList.add(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "true");
        setImmediate(() => targetElement.ownerDocument.addEventListener("mousedown", clickOutside));

        // Temporary hack to reposition popup:
        addEventListener(onPopupRepositionRequestedEvent, () => setImmediate(() => repositionPopup()));
    };

    if (!targetElement.classList.contains(showClassName)) {
        openTarget();
    }
};

addEventListener("mousedown", onClick, true);
addEventListener("keydown", onKeyDown, true);