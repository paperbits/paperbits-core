import * as ko from "knockout";

ko.bindingHandlers["alignment"] = {
    init: (arrowElement: HTMLElement, valueAccessor) => {
        const observable = valueAccessor();
        const alignment = arrowElement.getAttribute("alignment");

        ko.applyBindingsToNode(arrowElement, {
            click: () => {
                observable(alignment);
            },
            css: {
                active: ko.pureComputed(() => observable() === alignment)
            }
        })
    }
}