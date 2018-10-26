import * as ko from "knockout";

ko.bindingHandlers["height"] = {
    update: (element: HTMLElement, valueAccessor) => {
        const stretchObservable = valueAccessor();
        ko.applyBindingsToNode(element, { css: { stretch: stretchObservable } });
    }
};