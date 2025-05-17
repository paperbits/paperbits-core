import * as ko from "knockout";
import { EventManager } from "@paperbits/common/events";
import { ResizableOptions } from "@paperbits/common/ui/resizableOptions";
import { ResizableBehavior } from "@paperbits/common/behaviors/resizableBehavior";
import { BehaviorHandle } from "@paperbits/common/behaviors/behavior";

export class ResizableBindingHandler {
    constructor(private readonly eventManager: EventManager) {
        ko.bindingHandlers.resizable = {
            init: (element: HTMLElement, valueAccessor: () => string | ResizableOptions) => {
                const config = valueAccessor();
                let behaviorHandle: BehaviorHandle | null = null;

                const attachBehavior = (currentConfig: string | ResizableOptions) => {
                    if (behaviorHandle) {
                        behaviorHandle.detach();
                    }
                    behaviorHandle = ResizableBehavior.attach(element, ko.unwrap(currentConfig), this.eventManager);
                };

                attachBehavior(config);

                if (ko.isObservable(config)) {
                    const subscription = config.subscribe(attachBehavior);
                    ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                        subscription.dispose();
                        if (behaviorHandle) {
                            behaviorHandle.detach();
                        }
                    });
                } else {
                    ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                        if (behaviorHandle) {
                            behaviorHandle.detach();
                        }
                    });
                }
            }
        };
    }
}
