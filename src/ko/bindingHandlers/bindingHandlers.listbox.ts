import * as ko from "knockout";
import { ListboxBehavior, ListboxOptions } from "@paperbits/common/behaviors/behavior.listbox";

ko.bindingHandlers["listbox"] = {
    init: (listboxElement: HTMLElement, valueAccessor: () => ListboxOptions) => {
        const originalOptions = valueAccessor();

        // Adapt the onSelect callback to maintain the original contract (passing ko.dataFor(element))
        // while the behavior itself now passes the HTMLElement.
        const adaptedOptions: ListboxOptions = {
            onSelect: (selectedElement: HTMLElement) => {
                if (originalOptions && originalOptions.onSelect) {
                    originalOptions.onSelect(ko.dataFor(selectedElement));
                }
            }
        };

        const behaviorHandle = ListboxBehavior.attach(listboxElement, adaptedOptions);

        ko.utils.domNodeDisposal.addDisposeCallback(listboxElement, (): void => {
            if (behaviorHandle && behaviorHandle.detach) {
                behaviorHandle.detach();
            }
        });
    }
};