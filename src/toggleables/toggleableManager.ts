import * as Arrays from "@paperbits/common/arrays";
import { Keys, MouseButtons } from "@paperbits/common";
import { Events } from "@paperbits/common/events";
import { AriaAttributes, DataAttributes, closest, getFocusableElements } from "@paperbits/common/html";
import { ToggleableType, ToggleableTriggerEvent, ToggleableHandle } from "./";


const showClassName = "show";
const popupContainerClass = "popup-container";

export class ToggleablesManager {
    private stack: ToggleableHandle[] = [];

    constructor() {
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onPopupRequest = this.onPopupRequest.bind(this);
    }

    private runHitTest(targetElement: HTMLElement): void {
        const handles = [...this.stack]; // clone array

        for (const handle of handles.reverse()) {
            const hit = !!closest(targetElement, (node: HTMLElement) => node === handle.targetElement);

            if (hit) {
                break;
            }

            this.stack.pop();
            handle.close();
        }
    }

    private closeHandleStack(handle: ToggleableHandle): void {
        if (!this.stack.includes(handle)) {
            return;
        }

        let topHandle: ToggleableHandle;

        do {
            topHandle = this.stack.pop();
            topHandle.close();
        }
        while (!topHandle || topHandle !== handle);

        if (!topHandle) {
            return;
        }

        if (topHandle.toggleElement) {
            handle.toggleElement.focus();
        }
    }

    private openTogglable(toggleElement: HTMLElement, toggleType: ToggleableType, triggerEvent: ToggleableTriggerEvent): void {
        let toggleableHandle: ToggleableHandle;

        switch (toggleType) {
            case ToggleableType.popup:
                const targetSelector = toggleElement.getAttribute(DataAttributes.Target);

                if (!targetSelector) {
                    return;
                }

                const targetElement = <HTMLElement>document.querySelector(targetSelector);

                if (!targetElement) {
                    return;
                }

                toggleableHandle = this.configurePopup(toggleElement, targetElement, triggerEvent);
                break;

            case ToggleableType.dropdown: {
                const targetElement = <HTMLElement>toggleElement.parentElement.querySelector(".dropdown");
                toggleableHandle = this.configureToggleable(toggleElement, targetElement);
                break;
            }

            case ToggleableType.collapsible: {
                const targetElement = <HTMLElement>toggleElement.closest(".collapsible-panel");
                toggleableHandle = this.configureToggleable(toggleElement, targetElement);
                break;
            }

            default:
                console.warn(`Unknown data-toggle value ${toggleType}`);
        }

        this.stack.push(toggleableHandle);
    };

    private configureToggleable(toggleElement: HTMLElement, targetElement: HTMLElement): ToggleableHandle {
        if (!toggleElement || !targetElement) {
            return;
        }

        const dismissElements: HTMLElement[] = Arrays.coerce(targetElement.querySelectorAll(`[${DataAttributes.Dismiss}]`));

        const openTarget = (): void => {
            this.openTogglableInternal(targetElement, toggleElement);

            setImmediate(() => addEventListener(Events.MouseDown, clickOutside));

            for (const dismissElement of dismissElements) {
                dismissElement.addEventListener(Events.Click, closeTarget);
            }
        };

        const closeTarget = (): void => {
            this.closeTogglable(targetElement, toggleElement);
            removeEventListener(Events.MouseDown, clickOutside);

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
            targetElement: targetElement,
            toggleElement: toggleElement,
            close: closeTarget
        };

        return togglableHandle;
    };

    /**
     * Closes togglable element.
     * @param targetElement - The element that needs to be closed.
     * @param toggleElement - The element that triggered opening the target.
     */
    private closeTogglable(targetElement: HTMLElement, toggleElement: HTMLElement): void {
        targetElement.classList.remove(showClassName);

        if (toggleElement) {
            this.stack.pop();
            toggleElement.setAttribute(AriaAttributes.expanded, "false");


            const triggerEvent = toggleElement.getAttribute(DataAttributes.TriggerEvent);

            if (triggerEvent === ToggleableTriggerEvent.Hover) {
                return; // on "hover" focus doesn't change
            }

            setImmediate(() => toggleElement.focus());
        }
    }

    private openTogglableInternal(targetElement: HTMLElement, toggleElement: HTMLElement): void {
        targetElement.classList.add(showClassName);
        toggleElement.setAttribute(AriaAttributes.expanded, "true");

        const triggerEvent = toggleElement.getAttribute(DataAttributes.TriggerEvent);

        if (triggerEvent === ToggleableTriggerEvent.Hover) {
            return; // on "hover" focus doesn't change
        }

        const focusableElements = getFocusableElements(targetElement);

        if (focusableElements.length > 0) {
            const firstFocusableElement = <HTMLElement>focusableElements[0];
            firstFocusableElement.focus();
        }
    }

    private configurePopup(toggleElement: HTMLElement, targetElement: HTMLElement, triggerEvent: ToggleableTriggerEvent): ToggleableHandle {
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

        const checkOutsideClick = (event: MouseEvent): void => {
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
                case ToggleableTriggerEvent.Click:
                    targetElement.ownerDocument.removeEventListener(Events.MouseDown, checkOutsideClick);
                    break;

                case ToggleableTriggerEvent.Hover:
                    targetElement.ownerDocument.removeEventListener(Events.MouseMove, checkOutsideMove);
                    break;
            }

            this.closeTogglable(targetElement, toggleElement)

            // Temporary hack to reposition popup:
            document.removeEventListener(Events.PopupRepositionRequest, repositionPopup);
        };

        const openTarget = (): void => {
            for (const dismissElement of dismissElements) {
                dismissElement.addEventListener(Events.MouseDown, closeTarget);
            }

            this.openTogglableInternal(targetElement, toggleElement);

            setImmediate(() => {
                switch (triggerEvent) {
                    case ToggleableTriggerEvent.Click:
                        targetElement.ownerDocument.addEventListener(Events.MouseDown, checkOutsideClick);
                        break;

                    case ToggleableTriggerEvent.Hover:
                        targetElement.ownerDocument.addEventListener(Events.MouseMove, checkOutsideMove);
                        break;
                }

                repositionPopup();
            });

            // Temporary hack to reposition popup:
            document.addEventListener(Events.PopupRepositionRequest, repositionPopup);
        };

        if (!targetElement.classList.contains(showClassName)) {
            openTarget();
        }

        const togglableHandle: ToggleableHandle = {
            targetElement: targetElement,
            toggleElement: toggleElement,
            close: closeTarget
        };

        return togglableHandle;
    };

    public onPopupRequest(event: CustomEvent): void {
        const popupKey = event.detail;
        const targetSelector = `#${popupKey.replace("popups/", "popups")}`;
        const targetElement = <HTMLElement>document.querySelector(targetSelector);
        const triggerSelector = `[data-target="${targetSelector}"]`;
        const triggerElement = <HTMLElement>document.querySelector(triggerSelector);

        if (targetElement?.classList.contains(showClassName)) {
            return;
        }

        const openTargetElement = document.querySelector(`.${showClassName}`);

        if (openTargetElement) {
            openTargetElement.classList.remove(showClassName);
        }

        this.configurePopup(triggerElement, targetElement, ToggleableTriggerEvent.Click);
    };

    public onMouseEnter(event: MouseEvent): void {
        const eventTarget = <HTMLElement>event.target;
        const toggleElement = <HTMLElement>eventTarget.closest(`[${DataAttributes.Toggle}]`);

        if (!toggleElement) {
            return;
        }

        const triggerEvent = toggleElement.getAttribute(DataAttributes.TriggerEvent);

        if (triggerEvent !== ToggleableTriggerEvent.Hover) {
            return;
        }

        event.preventDefault();

        const toggleType = <ToggleableType>toggleElement.getAttribute(DataAttributes.Toggle);
        this.openTogglable(toggleElement, toggleType, ToggleableTriggerEvent.Hover);
    };

    public onKeyDown(event: KeyboardEvent): void {
        if (event.key === Keys.Escape) {
            const closestOpenTogglable = <HTMLElement>document.activeElement.closest(`.${showClassName}`);

            if (closestOpenTogglable) {
                /**
                 * TODO: 
                 * - Take into account native collapsibles like <select> element, before closing this one.
                 * - Keep track of which element was a toggle element to update "expand" state and set focus.
                 */
                const stackItem = this.stack.find(x => x.targetElement === closestOpenTogglable)

                this.closeTogglable(closestOpenTogglable, stackItem?.toggleElement);
            }

            return;
        }

        if (event.key !== Keys.Enter && event.key !== Keys.Space) {
            return;
        }
    };

    public onClick(event: MouseEvent): void {
        if (event.button !== MouseButtons.Main) {
            return;
        }

        const eventTarget = <HTMLElement>event.target;
        const toggleElement = <HTMLElement>eventTarget.closest(`[${DataAttributes.Toggle}]`);

        if (!toggleElement) {
            return;
        }

        event.preventDefault();

        const toggleType = <ToggleableType>toggleElement.getAttribute(DataAttributes.Toggle);
        this.openTogglable(toggleElement, toggleType, ToggleableTriggerEvent.Click);
    };
}


const mananger = new ToggleablesManager();
addEventListener(Events.Click, mananger.onClick, true);
addEventListener(Events.KeyDown, mananger.onKeyDown, true);
document.documentElement.addEventListener(Events.MouseEnter, mananger.onMouseEnter, true);
document.addEventListener(Events.PopupRequest, mananger.onPopupRequest);