import * as ko from "knockout";
import { IContextCommand, ViewManager, ViewManagerMode } from "@paperbits/common/ui";

interface CommandConfig {
    element: HTMLElement;
    command: IContextCommand;
}

export class ContextualCommandBindingHandler {
    constructor(viewManager: ViewManager) {
        ko.bindingHandlers["contextualCommand"] = {
            init(element: HTMLElement, valueAccessor: () => CommandConfig): void {
                const config = valueAccessor();

                const bindings = {
                    background: {
                        color: config.command.color
                    }
                };

                if (config.command.component) {
                    bindings["balloon"] = {
                        component: config.command.component,
                        onOpen: () => {
                            viewManager.pauseContextualCommands();

                            if (!!config.command.doNotClearSelection) {
                                return;
                            }

                            viewManager.clearSelection();
                        },
                        onClose: () => {
                            viewManager.resumeContextualCommands();
                        }
                    };
                }
                else if (config.command.callback) {
                    bindings["click"] = config.command.callback;
                }

                if (config.command.position) {
                    bindings["stickTo"] = { target: config.element, position: config.command.position };
                }

                bindings["tooltip"] = config.command.tooltip;

                ko.applyBindingsToNode(element, bindings, null);
            }
        };
    }
}