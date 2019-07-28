import * as ko from "knockout";

ko.bindingHandlers["tooltipToggle"] = {
    init: (triggerElement: HTMLElement, valueAccessor, allBindings) => {
        const tooltipText = valueAccessor();

        if (!tooltipText) {
            console.warn("No tooltip text specified for element: " + triggerElement.nodeType);
            return;
        }

        ko.applyBindingsToNode(triggerElement, {
            balloon: {
                component: {
                    name: "tooltip",
                    params: { text: tooltipText }
                },
                position: "top",
                isOpen: ko.observable()
            }
        }, null);
    }
};