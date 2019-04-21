import * as ko from "knockout";

ko.bindingHandlers["size"] = {
    update: (element: HTMLElement, valueAccessor) => {
        const config = valueAccessor();
        const width = ko.unwrap(config.width);
        const height = ko.unwrap(config.height);

        element.style.width = width ? width + "px" : null;
        element.style.height = height ? height + "px" : null;
    }
};

