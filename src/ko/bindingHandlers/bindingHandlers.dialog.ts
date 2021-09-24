import * as ko from "knockout";
import { KeyCodes } from "@paperbits/common/keyboard";
import { Events } from "@paperbits/common/events";

ko.bindingHandlers["dialog"] = {
    init(element: HTMLElement): void {
        setTimeout(() => {
            const focusables = `a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])`;
            const focusableElements = element.querySelectorAll(focusables);
            const firstFocusableElement = <HTMLElement>focusableElements[0];
            const lastFocusableElement = <HTMLElement>focusableElements[focusableElements.length - 1];

            const onKeyDown = (event: KeyboardEvent): void => {
                const isTabPressed = event.keyCode === KeyCodes.Tab;

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

            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }

            element.addEventListener(Events.KeyDown, onKeyDown);

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                element.removeEventListener(Events.KeyDown, onKeyDown);
            });
        }, 100);
    }
};