import { View, ViewManager } from "@paperbits/common/ui";
import * as ko from "knockout";


export class HelpCenterBindingHandler {
    constructor(private readonly viewManager: ViewManager) {
        ko.bindingHandlers["helpCenter"] = {
            init: (element: HTMLElement, valueAccessor: () => string): void => {
                const openHelpCenter = () => {
                    const articleKey = ko.unwrap(valueAccessor());

                    const view: View = {
                        heading: "Help center",
                        component: {
                            name: "help-center",
                            params: {
                                articleKey: articleKey,
                            }
                        },
                        resizing: {
                            directions: "vertically horizontally",
                            initialWidth: 500,
                            initialHeight: 700
                        },
                        scrolling: false
                    };

                    this.viewManager.openViewAsPopup(view);
                };

                ko.applyBindingsToNode(element, { activate: openHelpCenter }, null);
            }
        };
    }
}
