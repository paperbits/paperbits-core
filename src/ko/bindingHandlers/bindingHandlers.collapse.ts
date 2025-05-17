import * as ko from "knockout";
import { CollapseBehavior } from "@paperbits/common/behaviors/behavior.collapse";

ko.bindingHandlers["collapse"] = {
    init: (triggerElement: HTMLElement, valueAccessor) => {
        // timeout to let other bindings to bind id for collapsable container
        setTimeout(() => {
            const targetSelector = ko.unwrap(valueAccessor());
            const behaviorHandle = CollapseBehavior.attach(triggerElement, targetSelector);

            ko.utils.domNodeDisposal.addDisposeCallback(triggerElement, () => {
                if (behaviorHandle && behaviorHandle.detach) {
                    behaviorHandle.detach();
                }
            });
        }, 100);
    }
};