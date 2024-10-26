import { EventManager, Events } from "@paperbits/common/events";
import * as ko from "knockout";


export class LiveAreaBindingHandler {
    constructor(eventManager: EventManager) {
        ko.bindingHandlers["livearea"] = {
            init: (element: HTMLElement, valueAccessor: () => (data: unknown) => void, allBindings, viewModel) => {
                const notificationHandler = (notification: string) => {
                    element.innerText = notification;
                }

                eventManager.addEventListener(Events.NotificationRequest, notificationHandler);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    eventManager.removeEventListener(Events.NotificationRequest, notificationHandler);
                })
            }
        };
    }
}

