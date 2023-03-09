import * as ko from "knockout";
import { FocusBehavior, FocusOptions } from "@paperbits/common/behaviors/behavior.focus";

ko.bindingHandlers["focus"] = {
    init: (element: HTMLElement, valueAccessor: () => boolean | FocusOptions) => {
        const options = ko.unwrap(valueAccessor());
        FocusBehavior.attach(element, options);
    }
};