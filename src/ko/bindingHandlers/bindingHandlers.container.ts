import * as ko from "knockout";

ko.bindingHandlers["container"] = {
    update: (element: HTMLElement, valueAccessor: () => string) => {
        const config = ko.utils.unwrapObservable(valueAccessor());

        element.className = "";

        switch (config) {
            case "container":
                element.classList.add("container");
                break;

            case "container-thinner":
                element.classList.add("container", "container-thinner");
                break;

            default:
                element.classList.add("container-fluid");
        }
    }
};