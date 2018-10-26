import * as ko from "knockout";

ko.bindingHandlers["overflow"] = {
    update: (element: HTMLElement, valueAccessor) => {
        const oveflowConfig = ko.unwrap(valueAccessor());

        element.classList.remove("overflow");
        element.classList.remove("overflow-x");
        element.classList.remove("overflow-y");

        if (oveflowConfig.x && oveflowConfig.y) {
            element.classList.add("overflow");
        }
        else {
            if (oveflowConfig.x) {
                element.classList.add("overflow-x");
            }

            if (oveflowConfig.y) {
                element.classList.add("overflow-y");
            }
        }
    }
};