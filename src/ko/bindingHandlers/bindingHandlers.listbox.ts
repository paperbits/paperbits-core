import * as ko from "knockout";
import { ListboxBehavior } from "../../behaviors/behavior.listbox";

ko.bindingHandlers["listbox"] = {
    init: (listboxElement: HTMLElement, valueAccessor: () => void) => {
        const behaviorHandle = ListboxBehavior.attach(listboxElement, valueAccessor());

        ko.utils.domNodeDisposal.addDisposeCallback(listboxElement, (): void => {
            behaviorHandle.detach();
        });
    }
};