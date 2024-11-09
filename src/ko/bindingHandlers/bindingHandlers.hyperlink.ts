import * as ko from "knockout";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { HyperlinkBehavior } from "../../behaviors/hyperlinkBehavior";

ko.bindingHandlers["hyperlink"] = {
    update(element: HTMLElement, valueAccessor: () => HyperlinkModel): void {
        const hyperlink: HyperlinkModel = valueAccessor();
        const behavior = new HyperlinkBehavior();

        if (ko.isObservable(hyperlink)) {
            hyperlink.subscribe(newValue => behavior.apply(element, newValue));
        }

        const initial = ko.unwrap(hyperlink);
        behavior.apply(element, initial);
    }
};