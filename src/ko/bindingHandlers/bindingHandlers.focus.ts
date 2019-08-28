import * as ko from "knockout";

ko.bindingHandlers["focus"] = {
    init: (element: HTMLElement, valueAccessor: () => string) => {
        const options = ko.unwrap(valueAccessor());

        setTimeout(() => {
            const type = typeof options;

            if (type === "boolean" && options) {
                element.focus();
                return;
            }

            if (type === "object" && options["childSelector"]) {
                element = <HTMLElement>element.querySelector(options["childSelector"]);

                if (element) {
                    element.focus();
                }

                return;
            }
        }, 100);
    }
};