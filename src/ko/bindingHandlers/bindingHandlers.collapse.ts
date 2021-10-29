import * as ko from "knockout";
import { Keys } from "@paperbits/common/keyboard";
import { Events, MouseButton } from "@paperbits/common/events";

ko.bindingHandlers["collapse"] = {
    init: (triggerElement: HTMLElement, valueAccessor) => {
        // timeout to let other bindings to bind id for collapsable container

        const expanded: boolean = true;

        setTimeout(() => {
            const targetSelector = ko.unwrap(valueAccessor());
            const targetElement = document.querySelector(targetSelector);

            if (!targetElement) {
                return;
            }

            const visibleObservable = ko.observable(expanded);

            if (!triggerElement.hasAttribute("aria-label")) {
                triggerElement.setAttribute("aria-label", "Toggle section");
            }

            triggerElement.setAttribute("role", "button");
            triggerElement.setAttribute("aria-expanded", expanded.toString());

            targetElement.setAttribute("role", "region");
            targetElement.setAttribute("aria-hidden", (!expanded).toString());

            const toggle = (): void => {
                const newValue = !visibleObservable();
                visibleObservable(newValue);
                triggerElement.setAttribute("aria-expanded", newValue.toString());

                if (!targetElement) {
                    return;
                }

                targetElement.setAttribute("aria-hidden", (!newValue).toString());
            };

            const onPointerDown = (event: MouseEvent): void => {
                if (event.button !== MouseButton.Main) {
                    return;
                }
                toggle();
            };

            const onClick = (event: MouseEvent): void => {
                event.preventDefault();
                event.stopImmediatePropagation();
            };

            const onKeyDown = (event: KeyboardEvent): void => {
                if (event.key === Keys.Enter || event.key === Keys.Space) {
                    toggle();
                }
            };

            triggerElement.addEventListener(Events.Click, onClick);
            triggerElement.addEventListener(Events.KeyDown, onKeyDown);
            triggerElement.addEventListener(Events.MouseDown, onPointerDown);

            ko.applyBindingsToNode(targetElement, {
                css: { collapsed: ko.pureComputed(() => !visibleObservable()) }
            }, null);

            ko.applyBindingsToNode(triggerElement, {
                css: { collapsed: ko.pureComputed(() => !visibleObservable()) }
            }, null);

            ko.utils.domNodeDisposal.addDisposeCallback(triggerElement, () => {
                triggerElement.removeEventListener(Events.Click, onClick);
                triggerElement.removeEventListener(Events.KeyDown, onKeyDown);
                triggerElement.removeEventListener(Events.MouseDown, onPointerDown);
            });
        }, 100);
    }
};

ko.bindingHandlers["log"] = {
    init: (triggerElement, valueAccessor) => {
        console.log(valueAccessor());
    }
};