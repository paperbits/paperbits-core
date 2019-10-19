import * as ko from "knockout";

ko.bindingHandlers["toggleCollapsible"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const collapsible: HTMLElement = element.parentElement.parentElement.querySelector(".collapsible-content");

        const onClick = () => {
            collapsible.classList.toggle("show");
        };

        ko.applyBindingsToNode(element, {
            click: onClick
        }, null);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            //
        });
    }
};