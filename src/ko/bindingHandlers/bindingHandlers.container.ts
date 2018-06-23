import * as ko from "knockout";

ko.bindingHandlers["container"] = {
    init: (element: HTMLElement, valueAccessor: () => string) => {
        const config = ko.utils.unwrapObservable(valueAccessor());

        switch (config) {
            case "container":
                element.classList.add("container")
                break;
                
            case "container-thinner":
                element.classList.add("container", "container-thinner")
                break;
        }
    }
}