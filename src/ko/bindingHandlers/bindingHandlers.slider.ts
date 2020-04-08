import * as ko from "knockout";

export interface SliderConfig {
    onmousemove: (element: HTMLElement, position: number, index: number) => void;
    initialize: (element: HTMLElement, data: any) => void;
    data: any;
}

ko.bindingHandlers["slider"] = {
    init: (element: HTMLElement, valueAccessor: () => SliderConfig) => {
        const config = ko.unwrap(valueAccessor());
        let dragging = false
        let initialOffset = null;

        config.initialize(element, config.data);

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

            let index = 0;
            let node = element;
            while (node.previousElementSibling) {
                node = <HTMLElement>node.previousElementSibling;
                index += 1;
            }

            config.onmousemove(element, position, index);
        }

        element.addEventListener("mousedown", onMouseDown);
        element.addEventListener("mouseup", onMouseUp);
        element.parentElement.addEventListener("mousemove", onMouseMove);
    }
}
