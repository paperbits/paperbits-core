import * as ko from "knockout";
import { WhenInViewBehavior } from "@paperbits/common/behaviors/behavior.whenInView";

ko.bindingHandlers["whenInView"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const callback = valueAccessor();
        const behaviorHandle = WhenInViewBehavior.attach(element, callback);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            if (behaviorHandle && behaviorHandle.detach) {
                behaviorHandle.detach();
            }
        });
    }
};