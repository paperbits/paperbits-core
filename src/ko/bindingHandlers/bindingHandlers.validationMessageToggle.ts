import * as ko from "knockout";

ko.bindingHandlers["validationMessageToggle"] = {
    init: (triggerElement: HTMLElement, valueAccessor) => {
        const observable = valueAccessor();

        if (!ko.isObservable(observable) || !observable.isValid) {
            console.warn("No validation assigned to observable for element: " + triggerElement.nodeType);
            return;
        }

        ko.applyBindingsToNode(triggerElement, {
            visible: ko.pureComputed(() => !observable.isValid()),
            balloon: {
                component: {
                    name: "tooltip",
                    params: observable.error
                },
                position: "top",
                isOpen: ko.observable()
            }
        });
    }
}