import * as ko from "knockout";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { HyperlinkBehavior } from "@paperbits/common/behaviors/behavior.hyperlink";

ko.bindingHandlers["hyperlink"] = {
    update(element: HTMLElement, valueAccessor: () => HyperlinkModel): void {
        const hyperlink: HyperlinkModel = valueAccessor();
        let behaviorHandle: any;

        if (ko.isObservable(hyperlink)) {
            hyperlink.subscribe(newValue => {
                if (behaviorHandle && behaviorHandle.detach) {
                    behaviorHandle.detach();
                }
                behaviorHandle = HyperlinkBehavior.attach(element, newValue);
            });
        }

        const initial = ko.unwrap(hyperlink);
        behaviorHandle = HyperlinkBehavior.attach(element, initial);

        if (behaviorHandle && behaviorHandle.detach) {
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                behaviorHandle.detach();
            });
        }
    }
};