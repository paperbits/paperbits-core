import * as ko from "knockout";
import { IContextCommand } from "@paperbits/common/ui/IContextCommandSet";
import { AriaAttributes } from "@paperbits/common/html";

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

            if (command.displayName) {
                if (command.displayName instanceof Function) {
                    element.setAttribute(AriaAttributes.label, command.displayName());
                }
                else if (typeof command.displayName === "string") {
                    element.setAttribute(AriaAttributes.label, <string>command.displayName);
                }
                else {
                    console.warn("Unsupported display name type of command.");
                }
            }
        }

        ko.applyBindingsToNode(element, bindings, null);
    }
};