import { Events } from "@paperbits/common/events";
import * as ko from "knockout";

export interface SliderConfig {
    data?: any;
    percentage?: number;
    offset?: number;
    onChange: (viewModel: any, percentage: number) => void;
}

ko.bindingHandlers["angle"] = {
    init: (element: HTMLElement, valueAccessor: () => any) => {
        const config = valueAccessor();
        const angleObservable = config;
        const rect = element.getBoundingClientRect();
        const centerX = Math.floor(rect.width / 2);
        const centerY = Math.floor(rect.height / 2);
        let tracking = false;

        const determineAngle = (x: number, y: number) => {
            const dx = centerX - x;
            const dy = centerY - y;
            let theta = Math.atan2(dy, dx) * 180 / Math.PI;
            theta += -90;

            if (theta < 0) {
                theta += 360;
            }

            angleObservable(Math.floor(theta));
        };

        const onMouseDown = (event: MouseEvent) => {
            tracking = true;
            determineAngle(event.offsetX, event.offsetY);
        };

        const onMouseUp = (event: MouseEvent) => {
            tracking = false;
            determineAngle(event.offsetX, event.offsetY);
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!tracking) {
                return;
            }

            determineAngle(event.offsetX, event.offsetY);
        };

        element.addEventListener(Events.MouseDown, onMouseDown);
        element.addEventListener(Events.MouseUp, onMouseUp, true);
        element.addEventListener(Events.MouseMove, onMouseMove, true);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            element.removeEventListener(Events.MouseDown, onMouseDown);
            element.removeEventListener(Events.MouseUp, onMouseUp, true);
            element.removeEventListener(Events.MouseMove, onMouseMove, true);
        });
    }
};