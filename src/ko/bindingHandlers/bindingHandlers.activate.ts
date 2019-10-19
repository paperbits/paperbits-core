import * as ko from "knockout";
import { Keys } from "@paperbits/common";


ko.bindingHandlers["activate"] = {
    init: (element: HTMLElement, valueAccessor: () => (data: any) => void) => {
        const onActivate = valueAccessor();
        const data = ko.dataFor(element);

        const onClick = () => onActivate(data);

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.keyCode === Keys.Enter ||
                event.keyCode === Keys.Space) {
                onActivate(data);
            }
        };

        element.addEventListener("keydown", onKeyDown);
        element.addEventListener("click", onClick);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            element.removeEventListener("click", onClick);
            element.removeEventListener("keydown", onKeyDown);
        });
    }
};