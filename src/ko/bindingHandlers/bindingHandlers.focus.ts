import * as ko from "knockout";

ko.bindingHandlers["focus"] = {
    init: (element: HTMLElement, valueAccessor) => {
        element.focus();
    }
};