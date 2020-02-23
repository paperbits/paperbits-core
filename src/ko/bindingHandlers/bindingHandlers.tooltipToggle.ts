import * as ko from "knockout";

ko.bindingHandlers["tooltipToggle"] = {
    init: (triggerElement: HTMLElement, valueAccessor, allBindings) => {
        const tooltipText = valueAccessor();

        if (!tooltipText) {
            console.warn("No tooltip text specified for element: " + triggerElement.nodeType);
            return;
        }
        
        const textParams: any = {};
        let closeTimeout = 0;

        if (ko.isObservable(tooltipText)) {
            textParams.observableText = tooltipText;
            closeTimeout = 5000; // close after 5 sec
            triggerElement.setAttribute("aria-label", tooltipText());
        } else {
            textParams.text = tooltipText;
            triggerElement.setAttribute("aria-label", tooltipText);
        }

        triggerElement.setAttribute("role", "tooltip");
        triggerElement.setAttribute("aria-live", "polite");

        ko.applyBindingsToNode(triggerElement, {
            balloon: {
                component: {
                    name: "tooltip",
                    params: textParams
                },
                position: "top",
                isOpen: ko.observable(),
                closeTimeout: closeTimeout
            }
        }, null);
    }
};