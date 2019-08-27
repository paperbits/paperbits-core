import * as ko from "knockout";
import { Keys } from "@paperbits/common";

ko.bindingHandlers["collapse"] = {
    init: (triggerElement: HTMLElement, valueAccessor) => {
        // timeout to let other bindings to bind id for collapsable container

        setTimeout(() => {
            const targetSelector = ko.unwrap(valueAccessor());
            const targetElement = document.querySelector(targetSelector);
            const visibleObservable = ko.observable(true);

            const onPointerDown = (event: MouseEvent) => {
                if (event.button !== 0) {
                    return;
                }
                visibleObservable(!visibleObservable());
            };

            const onClick = (event: MouseEvent) => {
                event.preventDefault();
                event.stopImmediatePropagation();
            };

            const onKeyDown = (event: KeyboardEvent) => {
                event.preventDefault();
                event.stopImmediatePropagation();

                if (event.keyCode === Keys.Enter || event.keyCode === Keys.Space) {
                    visibleObservable(!visibleObservable());
                }
            };

            triggerElement.addEventListener("click", onClick);
            triggerElement.addEventListener("keydown", onKeyDown);
            triggerElement.addEventListener("mousedown", onPointerDown);

            ko.applyBindingsToNode(targetElement, {
                css: { collapsed: ko.pureComputed(() => !visibleObservable()) }
            }, null);

            ko.applyBindingsToNode(triggerElement, {
                css: { collapsed: ko.pureComputed(() => !visibleObservable()) }
            }, null);

            ko.utils.domNodeDisposal.addDisposeCallback(triggerElement, () => {
                triggerElement.removeEventListener("click", onClick);
                triggerElement.removeEventListener("keydown", onKeyDown);
                triggerElement.removeEventListener("mousedown", onPointerDown);
            });
        }, 100);
    }
};

ko.bindingHandlers["log"] = {
    init: (triggerElement, valueAccessor) => {
        console.log(valueAccessor());
    }
};