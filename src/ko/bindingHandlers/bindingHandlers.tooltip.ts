import * as ko from "knockout";
import { BalloonHandle, BalloonActivationOptions } from "@paperbits/common/ui/balloons";


const defaultTooltipDelayMs = 700;


ko.bindingHandlers["tooltip"] = {
    init: (triggerElement: HTMLElement, valueAccessor) => {
        const options = valueAccessor();

        if (!options) {
            return;
        }

        let tooltipMessage: any;
        let tooltipPosition: string = "top";
        let tooltipDelayMs: number;
        let balloonHandle: BalloonHandle;

        if (typeof options === "string" || ko.isObservable(options)) {
            tooltipMessage = options;
        }
        else {
            tooltipMessage = options.message;
            tooltipPosition = options.position || "top";
            tooltipDelayMs = options.delay;
        }

        if (!tooltipMessage) {
            // console.warn("No tooltip text specified for element: " + triggerElement.nodeName);
            return;
        }

        let hasText: boolean = false;
        const isDisabled: () => boolean = () => !hasText;

        const textParams: any = {};
        let closeTimeout = 0;

        if (ko.isObservable(tooltipMessage)) {
            textParams.observableText = tooltipMessage;
            closeTimeout = 5000; // close after 5 sec

            tooltipMessage.subscribe((message) => {
                hasText = !!message;

                if (hasText && balloonHandle) {
                    balloonHandle.updatePosition();
                }
            });
        }
        else {
            hasText = !!tooltipMessage;
            textParams.text = tooltipMessage;
        }

        ko.applyBindingsToNode(triggerElement, {
            balloon: {
                component: {
                    name: "tooltip",
                    params: textParams
                },
                position: tooltipPosition,
                delay: tooltipDelayMs || defaultTooltipDelayMs,
                activateOn: BalloonActivationOptions.hoverOrFocus,
                closeTimeout: closeTimeout,
                // isDisabled: isDisabled,
                onCreated: (handle) => {
                    balloonHandle = handle;
                }
            }
        }, null);
    }
};