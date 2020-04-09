import * as ko from "knockout";

export interface SliderConfig {
    onmousemove: (element: HTMLElement, position: number, index?: number) => void;
    initialize?: (element: HTMLElement, data: any) => void;
    data?: any;
    index?: number;
}

ko.bindingHandlers["slider"] = {
    init: (element: HTMLElement, valueAccessor: () => SliderConfig) => {
        const config = ko.unwrap(valueAccessor());
        let dragging = false
        let initialOffset = null;

        if (config.initialize && config.data) {
            config.initialize(element, config.data);
        }

        const onMouseDown = (event: MouseEvent) => {
            dragging = true;
            initialOffset = event.pageX - element.offsetLeft;
        }

        const onMouseUp = (event: MouseEvent) => {
            dragging = false;
        }

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
            
            let position =  x - initialOffset ;
            element.style.left = position + "px";

            if (config.index) {
                config.onmousemove(element, position, config.index);
            }

        }

        element.addEventListener("mousedown", onMouseDown);
        element.addEventListener("mouseup", onMouseUp);
        element.parentElement.addEventListener("mousemove", onMouseMove);
    }
}
