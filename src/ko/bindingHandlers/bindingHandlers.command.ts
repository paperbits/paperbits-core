import * as ko from "knockout";
import { IContextCommand } from "@paperbits/common/ui";

interface CommandConfig {
    element: HTMLElement;
    command: IContextCommand;
}

ko.bindingHandlers["command"] = {
    init(element: HTMLElement, valueAccessor: () => CommandConfig): void {
        const config = valueAccessor();

        // data-bind="stickTo: { target: contextualEditor.element, position: command.position }, balloon: { component: command.component, onOpen: $component.onHoverCommandActivate, onClose: $component.onHoverCommandDeactivate }, background: { color: command.color }, attr: { title: command.tooltip }">

        const bindings = {
            background: {
                color: config.command.color
            },
            attr: {
                title: config.command.tooltip
            }
        };

        if (config.command.component) {
            bindings["balloon"] = {
                component: config.command.component,
                // onOpen: $component.onHoverCommandActivate,
                // onClose: $component.onHoverCommandDeactivate
            };
        }
        else if (config.command.callback) {
            bindings["click"] = config.command.callback;
        }

        if (config.command.position) {
            bindings["stickTo"] = { target: config.element, position: config.command.position }
        }

        ko.applyBindingsToNode(element, bindings, null);
    }
};