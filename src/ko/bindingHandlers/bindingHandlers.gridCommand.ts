import * as ko from "knockout";
import { IContextCommand } from "@paperbits/common/ui/IContextCommandSet";

ko.bindingHandlers["gridCommand"] = {
    init(element: HTMLElement, valueAccessor: () => IContextCommand): void {
        const command = valueAccessor();

        if (!command) {
            return;
        }

        const bindings = {
            tooltip: command.tooltip
        };

        if (command.component) {
            bindings["balloon"] = { component: command.component };
        }

        if (command.callback) {
            bindings["activate"] = command.callback;
            element.setAttribute("role", "option");
        }

        ko.applyBindingsToNode(element, bindings, null);
    }
};