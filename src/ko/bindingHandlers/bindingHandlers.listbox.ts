import * as Array from "@paperbits/common";
import { Keys } from "@paperbits/common/keyboard";
import { Events } from "@paperbits/common/events";
import { AriaAttributes, Attributes } from "@paperbits/common/html";
import * as ko from "knockout";

const selectedClassName = "selected";
const optionElementSelector = "[role=option]";

ko.bindingHandlers["listbox"] = {
    init: (listboxElement: HTMLElement) => {
        let activeItemIndex: number;
        let optionElements: HTMLElement[];

        if (listboxElement.getAttribute(Attributes.Role) !== "listbox") {
            console.warn(`List and its child elements should have role="listbox" and role="options" attributes respectively.`);
            return;
        }

        listboxElement.setAttribute(Attributes.TabIndex, "0");

        const onKeyDown = (event: KeyboardEvent): void => {
            const eventTarget = <HTMLElement>event.target;

            if (!listboxElement.contains(eventTarget)) {
                return;
            }

            if (eventTarget.getAttribute(Attributes.Role) !== "option") {
                return;
            }

            optionElements = Array.coerce<HTMLElement>(listboxElement.querySelectorAll(optionElementSelector));

            const selectedElement = <HTMLElement>listboxElement.querySelector(`[${AriaAttributes.selected}]`);
            const lastActiveOption = optionElements[activeItemIndex];

            switch (event.key) {
                case Keys.ArrowDown:
                    event.preventDefault();

                    const nextIndex = activeItemIndex + 1;

                    if (nextIndex >= optionElements.length) {
                        return;
                    }

                    const nextListItem = optionElements[nextIndex];
                    nextListItem.setAttribute(Attributes.TabIndex, "0");
                    nextListItem.focus();
                    lastActiveOption.removeAttribute(Attributes.TabIndex);

                    activeItemIndex = nextIndex;

                    break;

                case Keys.ArrowUp:
                    event.preventDefault();
                    
                    const prevIndex = activeItemIndex - 1;

                    if (prevIndex < 0) {
                        return;
                    }

                    const prevListItem = optionElements[prevIndex];
                    prevListItem.setAttribute(Attributes.TabIndex, "0");
                    prevListItem.focus();
                    lastActiveOption.removeAttribute(Attributes.TabIndex);

                    activeItemIndex = prevIndex;

                    break;

                case Keys.Enter:
                case Keys.Space:
                    if (selectedElement) {
                        selectedElement.removeAttribute(AriaAttributes.selected);
                        selectedElement.classList.remove(selectedClassName);
                    }

                    lastActiveOption.setAttribute(AriaAttributes.selected, "true");
                    lastActiveOption.classList.add(selectedClassName);

                    break;
            }
        };

        const onContainerElementFocus = (): void => {
            optionElements = Array.coerce<HTMLElement>(listboxElement.querySelectorAll(optionElementSelector));

            if (optionElements.length === 0) {
                return;
            }

            let activeOption = optionElements.find(x => x.getAttribute(Attributes.TabIndex) === "0");

            if (activeOption) {
                activeOption.focus();
                return;
            }

            activeItemIndex = 0;
            activeOption = optionElements[activeItemIndex];
            activeOption.setAttribute(Attributes.TabIndex, "0");
            activeOption.focus();
        };

        const onGlobalFocusChange = (event: KeyboardEvent): void => {
            const eventTarget = <HTMLElement>event.target;

            if (listboxElement.contains(eventTarget)) {
                listboxElement.removeAttribute(Attributes.TabIndex);
            }
            else {
                listboxElement.setAttribute(Attributes.TabIndex, "0");
            }
        };

        document.addEventListener(Events.KeyDown, onKeyDown, true);
        document.addEventListener(Events.Focus, onGlobalFocusChange, true);
        listboxElement.addEventListener(Events.Focus, onContainerElementFocus);

        ko.utils.domNodeDisposal.addDisposeCallback(listboxElement, (): void => {
            document.removeEventListener(Events.KeyDown, onKeyDown, true);
            document.removeEventListener(Events.Focus, onGlobalFocusChange, true);
            listboxElement.removeEventListener(Events.Focus, onContainerElementFocus);
        });
    }
};