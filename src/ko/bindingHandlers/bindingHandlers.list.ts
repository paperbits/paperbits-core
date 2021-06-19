import * as Array from "@paperbits/common";
import { AriaAttributes } from "@paperbits/common/html";
import * as ko from "knockout";

ko.bindingHandlers["list"] = {
    init: (containerElement: HTMLElement, valueAccessor) => {
        const config = ko.unwrap(valueAccessor());


        const onKeyDown = (event: KeyboardEvent): void => {
            if (!containerElement.contains(<HTMLElement>event.target)) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            const activeListItem = <HTMLElement>document.activeElement;
            const listItems = Array.coerce<HTMLElement>(containerElement.querySelectorAll("[role=option]"));

            const activeItemIndex = listItems.indexOf(activeListItem);


            const selectedElement = <HTMLElement>containerElement.querySelector(`[${AriaAttributes.selected}]`);

            switch (event.key) {
                case "ArrowDown":
                    const nextIndex = activeItemIndex + 1;

                    if (nextIndex >= listItems.length) {
                        return;
                    }

                    const nextListItem = listItems[nextIndex];
                    nextListItem.focus();

                    break;

                case "ArrowUp":
                    const prevIndex = activeItemIndex - 1;

                    if (prevIndex < 0) {
                        return;
                    }
                    const prevListItem = listItems[prevIndex];
                    prevListItem.focus();

                    break;

                case "Enter":
                    if (selectedElement) {
                        selectedElement.removeAttribute(AriaAttributes.selected);
                        selectedElement.classList.remove("selected");
                    }

                    activeListItem.setAttribute(AriaAttributes.selected, "true");
                    activeListItem.classList.add("selected");

                    break;
            }
        };

        document.addEventListener("keydown", onKeyDown, true);

        ko.utils.domNodeDisposal.addDisposeCallback(containerElement, () => {
            document.removeEventListener("keydown", onKeyDown, true);
        });
    }
};