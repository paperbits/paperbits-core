import * as ko from "knockout";
import { ListboxBehavior, ListboxOptions } from "@paperbits/common/behaviors/behavior.listbox";

ko.bindingHandlers["listbox"] = {
    init: (listboxElement: HTMLElement, valueAccessor: () => ListboxOptions) => {
        const behaviorHandle = ListboxBehavior.attach(listboxElement, valueAccessor());

        ko.utils.domNodeDisposal.addDisposeCallback(listboxElement, (): void => {
            behaviorHandle.detach();
        });
    }
};