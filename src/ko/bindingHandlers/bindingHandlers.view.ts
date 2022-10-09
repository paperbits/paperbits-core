import * as ko from "knockout";
import { View } from "@paperbits/common/ui";


ko.bindingHandlers["view"] = {
    init: function (element: any, valueAccessor: any, ignored1: any, ignored2: any, bindingContext: any): any {
        const view: View = valueAccessor();

        const componentBinder = view.component.binder;

        if (!componentBinder) {
            console.log(view.component)
            ko.applyBindingsToNode(element, { component: view.component }, null);
            return;
        }

        componentBinder.bind(element, view.component.definition, view.component.params);

        if (componentBinder.unbind) {
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => componentBinder.unbind(element));
        }
    }
}