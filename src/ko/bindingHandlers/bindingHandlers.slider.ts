import * as ko from "knockout";

export interface SliderConfig {
    onmousemove: (data: any, percentage: number) => void;
    onmousedrop?: () => void;
    data?: any;
    percentage?: number;
    offset?: number;
}

ko.bindingHandlers["slider"] = {
    init: (element: HTMLElement, valueAccessor: () => SliderConfig) => {
        const config = ko.unwrap(valueAccessor());
        const parentWidth = element.parentElement.getBoundingClientRect().width;
        const offset = config.offset || 0;

        let percentage = config.percentage || 0;
        let dragging = false;
        let initialOffset = null;

        element.style.left = parentWidth * 1.0 / 100 * percentage - offset + "px";

        const onMouseDown = (event: MouseEvent) => {
            dragging = true;
            initialOffset = event.pageX - element.offsetLeft;
        };

        const onMouseUp = (event: MouseEvent) => {
            dragging = false;
            if (config.onmousedrop) {
                config.onmousedrop();
            }
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!dragging) {
                return;
            }
            
            const parentRect = element.parentElement.getBoundingClientRect();
            let x = event.pageX;
            
            if (x < parentRect.x) {
                x =  parentRect.x;
            }
            
            if (x > parentRect.x + parentRect.width) {
                x =  parentRect.x + parentRect.width;
            }
            
            const position =  x - initialOffset ;
            element.style.left = position + "px";
            percentage = (position + offset) / parentWidth * 100;
            config.onmousemove(config.data, percentage);

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
