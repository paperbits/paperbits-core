import * as ko from "knockout";
import { ViewManager } from "@paperbits/common/ui";
import { StickToBehavior, StickToConfig } from "@paperbits/common/behaviors/behavior.stickTo";


export class StickToBindingHandler {
    constructor(viewManager: ViewManager) {
        ko.bindingHandlers["stickTo"] = {
            init(element: HTMLElement, valueAccessor: () => StickToConfig): void {
                const config = valueAccessor();
                const handle = StickToBehavior.attach(element, config, viewManager);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    handle.detach();
                });
            }
        };
    }
}
