import * as ko from "knockout";
import { Keys } from "@paperbits/common";
import { Events } from "@paperbits/common/events";


ko.bindingHandlers["activate"] = {
    init: (element: HTMLElement, valueAccessor: () => (data: any) => void) => {
        const onActivate = valueAccessor();
        const data = ko.dataFor(element);

        const onClick = (event: PointerEvent) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            onActivate(data);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== Keys.Enter && event.key !== Keys.Space) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();
            onActivate(data);
        };

        element.addEventListener(Events.KeyDown, onKeyDown);
        element.addEventListener(Events.Click, onClick);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            element.removeEventListener(Events.Click, onClick);
            element.removeEventListener(Events.KeyDown, onKeyDown);
        });
    }
};