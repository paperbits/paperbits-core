import * as ko from "knockout";

ko.bindingHandlers["attr2way"] = {
    init: (element: HTMLElement, valueAccessor: () => any) => {
        const config = valueAccessor();
        const attributeNames = Object.keys(config);

        const callback: MutationCallback = (mutations: MutationRecord[], observer: MutationObserver) => {
            for (const mutation of mutations) {
                if (mutation.type === "attributes" && attributeNames.includes(mutation.attributeName)) {
                    const value = element.getAttribute(mutation.attributeName);

                    const observable = config[mutation.attributeName];

                    if (observable() !== value) {
                        observable(value);
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);

        observer.observe(element, { attributes: true });

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            observer.disconnect();
        });
    }
};