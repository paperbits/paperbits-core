import * as ko from "knockout";

ko.bindingHandlers["tooltip"] = {
    init: (triggerElement: HTMLElement, valueAccessor) => {
        const options = valueAccessor();

        let tooltipMessage: any;
        let tooltipPosition: string = "top";

        if (typeof options === "string" || ko.isObservable(options)) {
            tooltipMessage = options;
        }
        else {
            tooltipMessage = options.message;
            tooltipPosition = options.position || "top";
        }

        if (!tooltipMessage) {
            // console.warn("No tooltip text specified for element: " + triggerElement.nodeName);
            return;
        }

        const isOpen = ko.observable();
        const textParams: any = {};
        let closeTimeout = 0;

        if (ko.isObservable(tooltipMessage)) {
            textParams.observableText = tooltipMessage;
            closeTimeout = 5000; // close after 5 sec
            triggerElement.setAttribute("aria-label", tooltipMessage());
        }
        else {
            textParams.text = tooltipMessage;
            triggerElement.setAttribute("aria-label", tooltipMessage);
        }

        triggerElement.setAttribute("role", "tooltip");
        triggerElement.setAttribute("aria-live", "polite");

        let balloonHandle;

        ko.applyBindingsToNode(triggerElement, {
            balloon: {
                component: {
                    name: "tooltip",
                    params: textParams
                },
                position: tooltipPosition,
                isOpen: isOpen,
                closeTimeout: closeTimeout,
                onCreated: (handle) => {
                    balloonHandle = handle;
                }
            },
            event: {
                mouseenter: () => {
                    balloonHandle.open();
                },
                mouseleave: () => {
                    setTimeout(() => {
                        balloonHandle.close();
                    }, 300);
                }
            }
        }, null);
    }
};