import * as ko from "knockout";
import { View } from "@paperbits/common/ui";
import { ViewBehavior } from "@paperbits/common/behaviors/behavior.view";


ko.bindingHandlers["view"] = {
    init: function (element: HTMLElement, valueAccessor: () => View): any {
        const view = valueAccessor();
        const componentBinder = view.component.binder;

        if (!componentBinder) {
            ko.applyBindingsToNode(element, { component: view.component }, null);
            return;
        }

        const behaviorHandle = ViewBehavior.attach(element, view);

        if (behaviorHandle && behaviorHandle.detach) {
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                behaviorHandle.detach();
            });
        }
    }
};