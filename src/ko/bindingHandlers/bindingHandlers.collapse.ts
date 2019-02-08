import * as ko from "knockout";

ko.bindingHandlers["collapse"] = {
    init: (triggerElement: HTMLElement, valueAccessor) => {
        // timeout to let other bindings to bind id for collapsable container
        setTimeout(() => {
            const targetSelector = ko.unwrap(valueAccessor());
            const targetElement = document.querySelector(targetSelector);
            const visibleObservable = ko.observable(true);
            const triggerClassObservable = ko.observable()

            const onPointerDown = (event: MouseEvent) => {
                if (event.button !== 0) {
                    return;
                }
                visibleObservable(!visibleObservable());
            }

            const onClick = (event: MouseEvent) => {
                event.preventDefault();
                event.stopImmediatePropagation();
            }

            triggerElement.addEventListener("click", onClick);
            triggerElement.addEventListener("mousedown", onPointerDown);

            ko.applyBindingsToNode(targetElement, {
                css: { collapsed: ko.pureComputed(() => !visibleObservable()) }
            }, null);

            ko.applyBindingsToNode(triggerElement, {
                css: { collapsed: ko.pureComputed(() => !visibleObservable()) }
            }, null);

            ko.utils.domNodeDisposal.addDisposeCallback(triggerElement, () => {
                triggerElement.removeEventListener("mousedown", onPointerDown);
            });
        }, 100);        
    }
}

ko.bindingHandlers["log"] = {
    init: (triggerElement, valueAccessor) => {
        console.log(valueAccessor());
    }
}