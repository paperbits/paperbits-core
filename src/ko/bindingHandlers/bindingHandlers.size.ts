import * as ko from "knockout";

ko.bindingHandlers["size"] = {
    update: (element: HTMLElement, valueAccessor) => {
        const config = valueAccessor();

        const width = ko.unwrap(config.width);
        const height = ko.unwrap(config.height);

        if (width) {
            element.style.width = width + "px";
        }
        else {
            delete element.style["width"];
        }

        if (height) {
            element.style.height = height + "px";
        }
        else {
            delete element.style["height"];
        }
    }
};

