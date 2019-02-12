import * as ko from "knockout";
import { IContextCommand } from "@paperbits/common/ui";

ko.bindingHandlers["command"] = {
    init(element: HTMLElement, valueAccessor: () => IContextCommand) {
        const contextCommand = valueAccessor();

        const bindings = {
            background: {
                color: contextCommand.color
            },
            attr: {
                title: contextCommand.tooltip
            }
        };

        if (contextCommand.component) {
            bindings["balloon"] = {
                component: contextCommand.component,
                // onOpen: $component.onHoverCommandActivate,
                // onClose: $component.onHoverCommandDeactivate
            };
        }
        else if (contextCommand.callback) {
            bindings["click"] = contextCommand.callback;
        }

        ko.applyBindingsToNode(element, bindings, null);
    }
};