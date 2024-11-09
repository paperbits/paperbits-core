import { LiveAreaBehavior } from "@paperbits/common/behaviors/liveAreaBehavior";
import { EventManager } from "@paperbits/common/events";
import * as ko from "knockout";

export class LiveAreaBindingHandler {
    constructor(eventManager: EventManager) {
        ko.bindingHandlers["livearea"] = {
            init: (element: HTMLElement) => {
                const behaviorHandle = LiveAreaBehavior.attach(element, eventManager);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    behaviorHandle.detach();
                });
            }
        };
    }
}

