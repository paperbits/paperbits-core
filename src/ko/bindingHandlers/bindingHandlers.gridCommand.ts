import * as ko from "knockout";
import { IContextualEditorCommand } from "@paperbits/common/ui/IContextualEditor";

ko.bindingHandlers["gridCommand"] = {
    init(element: HTMLElement, valueAccessor: () => IContextualEditorCommand) {
        let command = valueAccessor();

        if (!command) {
            return;
        }

        let bindings = {
            background: { color: command.color },
            attr: { title: command.tooltip }
        }

        if (command.component) {
            bindings["balloon"] = { target: '#sc-' + command.component.name, position: 'top' };
        }

        if (command.callback) {
            bindings["click"] = command.callback;
        }

        ko.applyBindingsToNode(element, bindings);
    }
};