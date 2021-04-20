import * as ko from "knockout";

ko.bindingHandlers["confirm"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const observable = ko.unwrap(valueAccessor());
        const message = observable.message;
        const onConfirm = observable.onConfirm;

        let balloon;

        ko.applyBindingsToNode(element, {
            balloon: {
                component: {
                    name: "confirmation",
                    params: {
                        getMessage: async () => {
                            return message;
                        },
                        onConfirm: async () => {
                            onConfirm();
                            balloon.close();
                        },
                        onDecline: () => {
                            balloon.close();
                        }
                    }
                },
                onCreated: (balloonHandle) => {
                    balloon = balloonHandle;
                },
                position: "top"
            }
        }, null);
    }
};