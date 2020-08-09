import * as ko from "knockout";

ko.bindingHandlers["selectable"] = {
    init: (element: HTMLElement, valueAccessor) => {
        setImmediate(() => {
            if (element.classList.contains("selected")) {
                element.scrollIntoView({ block: "center" });
            }
        });
    }
};
