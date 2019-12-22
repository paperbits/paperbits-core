import * as ko from "knockout";

ko.bindingHandlers["alignment"] = {
    init: (arrowElement: HTMLElement, valueAccessor) => {
        const config = ko.unwrap(valueAccessor());
        const alignment = arrowElement.getAttribute("alignment");

        ko.applyBindingsToNode(arrowElement, {
            click: () => {
                config.onChange(alignment);
            },
            css: {
                active: ko.pureComputed(() => config.position() === alignment)
            }
        }, null);
    }
};