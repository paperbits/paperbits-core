import * as ko from "knockout";
import { Keys } from "@paperbits/common/keyboard";
import { Events } from "@paperbits/common/events";
import { coerce } from "@paperbits/common/arrays";


const isVisible = (element: HTMLElement) => {
    const box = element.getBoundingClientRect();
    return box.width && box.height;
};

const getFocusableElements = (element: HTMLElement) => {
    return coerce<HTMLElement>(element.querySelectorAll("*")).filter(x => x.tabIndex >= 0 && isVisible(x));
};

ko.bindingHandlers["dialog"] = {
    init(element: HTMLElement): void {
        const onKeyDown = (event: KeyboardEvent): void => {
            const focusableElements = getFocusableElements(element);
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
            const focusableElements = getFocusableElements(element);

            if (focusableElements.length === 0) {
                return;
            }

            const firstFocusableElement = <HTMLElement>focusableElements[0];

            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        }, 100); // giving chance to controls to render

        element.addEventListener(Events.KeyDown, onKeyDown);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            element.removeEventListener(Events.KeyDown, onKeyDown);
        });
    }
};