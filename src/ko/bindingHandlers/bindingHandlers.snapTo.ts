import * as ko from "knockout";

ko.bindingHandlers["snapTo"] = {
    init(element: HTMLElement, valueAccessor: () => any) {
        let config = valueAccessor();

        if (ko.isObservable(config)) {
            config.subscribe(newConfig => {
                element.classList.remove("sticky-top-shadow");
                element.classList.remove("sticky-bottom-shadow");
                element.classList.remove("sticky-top");
                element.classList.remove("sticky-bottom");

                if (newConfig) {
                    if (newConfig === "top") {
                        element["snapClass"] = "sticky-top";
                        element.classList.add("sticky-top");
                    }

                    if (newConfig === "bottom") {
                        element["snapClass"] = "sticky-bottom";
                        element.classList.add("sticky-bottom");
                    }
                }
            })
        }
    }
};
