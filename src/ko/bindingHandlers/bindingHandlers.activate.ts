import * as ko from "knockout";
import { ActivateBehavior } from "@paperbits/common/behaviors/behavior.activate";


ko.bindingHandlers["activate"] = {
    init: (element: HTMLElement, valueAccessor: () => (data: unknown) => void, allBindings, viewModel) => {
        const onActivate = valueAccessor();

        if (!onActivate) {
            console.warn(`Callback function for binding handler "activate" in undefined.`);
            return null;
        }

        const handle = ActivateBehavior.attach(element, {
            onActivate: onActivate.bind(viewModel),
            data: ko.dataFor(element)
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            handle.detach();
        })
    }
};