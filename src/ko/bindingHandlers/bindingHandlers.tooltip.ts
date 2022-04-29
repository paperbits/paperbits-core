import * as ko from "knockout";
import { BalloonHandle, BalloonActivationMethod } from "@paperbits/common/ui/balloons";


const defaultTooltipDelayMs = 700;

interface TooltipOptions {
    /**
     * Tooltip message.
     */
    message: string;

    /**
     * Preferred tooltip position, e.g. `top`.
     */
    position: string;

    /**
     * Delay in milliseconds.
     */
    delay: number;

    /**
     * Activation method.
     */
    activateOn: BalloonActivationMethod;

    /**
     * Idicates if the tooltip is disabled.
     */
    isDisabled: ko.Observable<boolean>;
}


ko.bindingHandlers["tooltip"] = {
    init: (triggerElement: HTMLElement, valueAccessor: () => TooltipOptions) => {
        const options = valueAccessor();

        if (!options) {
            return;
        }

        let tooltipMessage: any;
        let tooltipPosition: string = "top";
        let tooltipDelayMs: number;
        let balloonHandle: BalloonHandle;
        const activateOn: BalloonActivationMethod = options.activateOn || BalloonActivationMethod.hoverOrFocus;

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
        const isDisabled: () => boolean = () => !!options.isDisabled ? options.isDisabled() : false;

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
                activateOn: activateOn,
                closeTimeout: closeTimeout,
                isDisabled: isDisabled,
                onCreated: (handle: BalloonHandle): void => {
                    balloonHandle = handle;
                }
            }
        }, null);
    }
};