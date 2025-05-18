import * as ko from "knockout";

export function registerKnockoutBehavior(behaviorName: string, BehaviorClass) {
    ko.bindingHandlers[behaviorName] = {
        init: (element, valueAccessor, allBindings, viewModel, context) => {
            const params = ko.unwrap(valueAccessor());
             // Ensure params are converted to a plain object if needed
            const behavior = new BehaviorClass(element, params);

            // store instance using Knockout's DOM data utils
            ko.utils.domData.set(element, behaviorName, behavior);

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                behavior.dispose();
                ko.utils.domData.set(element, behaviorName, null);
            });

            behavior.init();
        },
        update: (element, valueAccessor) => {
            const behavior = ko.utils.domData.get(element, behaviorName);
            if (behavior.update) {
                behavior.update(ko.unwrap(valueAccessor()));
            }
        }
    };
}