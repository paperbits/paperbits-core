import * as ko from "knockout";

ko.bindingHandlers["focus"] = {
    init: (element: HTMLElement, valueAccessor) => {
        setTimeout(() => element.focus(), 100);
    }
};