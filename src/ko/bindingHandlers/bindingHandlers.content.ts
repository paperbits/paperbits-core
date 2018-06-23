import * as ko from "knockout";

export class ContentBindingHandler {
    constructor() {
        ko.bindingHandlers["content"] = {
            update(element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext): void {
                var observable = valueAccessor();

                if (observable() === element.innerHTML)
                    return;

                ko.utils.setHtml(element, observable);
                ko.applyBindingsToDescendants(bindingContext, element);
            }
        };
    }
}