import * as ko from "knockout";
import { AlignBehavior, AlignBehaviorOptions } from "@paperbits/common/behaviors/behavior.align";

ko.bindingHandlers["alignment"] = {
    init: (arrowElement: HTMLElement, valueAccessor) => {
        const config = ko.unwrap(valueAccessor());
        const alignment = arrowElement.getAttribute("alignment");

        // Attach the behavior for click handling
        const behaviorOptions: AlignBehaviorOptions = {
            onAlign: () => {
                if (config.onChange) {
                    config.onChange(alignment);
                }
            }
        };
        const behaviorHandle = AlignBehavior.attach(arrowElement, behaviorOptions);

        // Apply CSS binding for active state
        ko.applyBindingsToNode(arrowElement, {
            css: {
                active: ko.pureComputed(() => config.position && config.position() === alignment)
            }
        }, null);

        // Dispose behavior on element disposal
        ko.utils.domNodeDisposal.addDisposeCallback(arrowElement, () => {
            if (behaviorHandle && behaviorHandle.detach) {
                behaviorHandle.detach();
            }
        });
    }
};