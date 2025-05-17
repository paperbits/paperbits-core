import * as ko from "knockout";
import { Attr2wayBehavior, Attr2wayConfig } from "@paperbits/common/behaviors/behavior.attr2way";

ko.bindingHandlers["attr2way"] = {
    init: (element: HTMLElement, valueAccessor: () => any) => {
        const originalConfig = valueAccessor();
        const attributeNames = Object.keys(originalConfig);
        
        // The behavior needs a way to update the Knockout observables.
        // We create a new config that maps attribute names to functions that update the corresponding observable.
        const behaviorConfig: Attr2wayConfig = {};

        for (const attrName of attributeNames) {
            const observable = originalConfig[attrName];
            if (ko.isObservable(observable)) {
                behaviorConfig[attrName] = (value: string | null) => {
                    if (observable() !== value) {
                        observable(value);
                    }
                };
            }
        }

        const behaviorHandle = Attr2wayBehavior.attach(element, behaviorConfig);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            if (behaviorHandle && behaviorHandle.detach) {
                behaviorHandle.detach();
            }
        });
    }
};