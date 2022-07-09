import * as ko from "knockout";
import { Size } from "@paperbits/styles/size";


ko.bindingHandlers["size"] = {
    update: (element: HTMLElement, valueAccessor) => {
        const config = valueAccessor();
        const width = ko.unwrap(config.width);
        const height = ko.unwrap(config.height);

        const parsedWidth = Size.parse(width);
        const parsedHeight = Size.parse(height);

        if (width) {
            element.setAttribute("width", parsedWidth.value.toString());
            element.style.width = parsedWidth.toString();
        }
        else {
            element.removeAttribute("width");
        }

        if (height) {
            element.setAttribute("height", parsedHeight.value.toString());
            element.style.height = parsedHeight.toString();
        }
        else {
            element.removeAttribute("height");
        }
    }
};
