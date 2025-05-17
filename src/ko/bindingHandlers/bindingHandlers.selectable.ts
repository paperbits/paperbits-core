import * as ko from "knockout";
import { SelectableBehavior } from "@paperbits/common/behaviors";

ko.bindingHandlers["selectable"] = {
    init: (element: HTMLElement, valueAccessor) => {
        SelectableBehavior.attach(element);
    }
};
