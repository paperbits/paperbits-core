import * as ko from "knockout";

export interface SliderConfig {
    data?: any;
    percentage?: number;
    offset?: number;
    onChange: (viewModel: any, percentage: number) => void;
}

ko.bindingHandlers["slider"] = {
    init: (element: HTMLElement, valueAccessor: () => SliderConfig, allBindings, viewModel, bindingContext) => {
        const config = ko.unwrap(valueAccessor());
        const parentWidth = element.parentElement.getBoundingClientRect().width;
        const offset = config.offset || 0;
        const data = bindingContext["$data"];

        let percentage = ko.unwrap(config.percentage) || 0;
        let dragging = false;
        let initialOffset = null;

        element.style.left = parentWidth * 1.0 / 100 * percentage - offset + "px";

        const onMouseDown = (event: MouseEvent) => {
            dragging = true;
            initialOffset = event.pageX - element.offsetLeft;
        };

        const onMouseUp = (event: MouseEvent) => {
            dragging = false;

            if (config.onChange) {
                config.onChange(data, percentage);
            }

            if (ko.isObservable(config.percentage)) {
                config.percentage(percentage);
            }
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!dragging) {
                return;
            }

            const parentRect = element.parentElement.getBoundingClientRect();
            let x = event.pageX;

            if (x < parentRect.x) {
                x = parentRect.x;
            }

            if (x > parentRect.x + parentRect.width) {
                x = parentRect.x + parentRect.width;
            }

            const position = x - initialOffset;
            percentage = Math.floor((position + offset) / parentWidth * 100);

            if (percentage < 0) {
                return;
            }
            
            element.style.left = position + "px";

            if (config.onChange) {
                config.onChange(data, percentage);
            }

            if (ko.isObservable(config.percentage)) {
                config.percentage(percentage);
            }
        };

        element.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp, true);
        window.addEventListener("mousemove", onMouseMove, true);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            element.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp, true);
            window.removeEventListener("mousemove", onMouseMove, true);
        });
    }
};
