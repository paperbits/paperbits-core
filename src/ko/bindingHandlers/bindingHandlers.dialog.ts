import * as ko from "knockout";
import { Keys } from "@paperbits/common/keyboard";
import { Events } from "@paperbits/common/events";

const focusables = `[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]`;

ko.bindingHandlers["dialog"] = {
    init(element: HTMLElement): void {
        const onKeyDown = (event: KeyboardEvent): void => {
            const focusableElements = element.querySelectorAll(focusables);
            const firstFocusableElement = <HTMLElement>focusableElements[0];
            const lastFocusableElement = <HTMLElement>focusableElements[focusableElements.length - 1];
            const isTabPressed = event.key === Keys.Tab;

            if (!isTabPressed) {
                return;
            }

            if (event.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    event.preventDefault();
                }
            }
            else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    event.preventDefault();
                }
            }
        };

        setTimeout(() => {
            const focusableElements = element.querySelectorAll(focusables);
            const firstFocusableElement = <HTMLElement>focusableElements[0];

            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        }, 100);

        element.addEventListener(Events.KeyDown, onKeyDown);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            element.removeEventListener(Events.KeyDown, onKeyDown);
        });
    }
};