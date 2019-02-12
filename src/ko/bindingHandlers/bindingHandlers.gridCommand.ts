import * as ko from "knockout";
import { IContextCommand } from "@paperbits/common/ui/IContextCommandSet";

ko.bindingHandlers["gridCommand"] = {
    init(element: HTMLElement, valueAccessor: () => IContextCommand) {
        const command = valueAccessor();

        if (!command) {
            return;
        }

        const bindings = {
            background: { color: command.color },
            attr: { title: command.tooltip }
        };

        if (command.component) {
            bindings["balloon"] = { target: "#sc-" + command.component.name, position: "top" };
        }

        if (command.callback) {
            bindings["click"] = command.callback;
        }

        ko.applyBindingsToNode(element, bindings, null);
    }
};