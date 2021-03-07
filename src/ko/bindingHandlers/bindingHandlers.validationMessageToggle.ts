import * as ko from "knockout";

ko.bindingHandlers["validationMessageToggle"] = {
    init: (triggerElement: HTMLElement, valueAccessor) => {
        const observable = valueAccessor();

        if (!ko.isObservable(observable) || !(<any>observable).isValid) {
            console.warn("No validation assigned to observable for element: " + triggerElement.nodeType);
            return;
        }

        ko.applyBindingsToNode(triggerElement, {
            visible: ko.pureComputed(() => !(<any>observable).isValid()),
            balloon: {
                component: {
                    name: "tooltip",
                    params: { text: (<any>observable).error }
                },
                position: "top"
            }
        }, null);
    }
};