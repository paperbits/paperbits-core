import { Events } from "@paperbits/common/events";
import * as ko from "knockout";
import { AngleBehavior, AngleBehaviorOptions } from "@paperbits/common/behaviors/behavior.angle";

ko.bindingHandlers["angle"] = {
    init: (element: HTMLElement, valueAccessor: () => ko.Observable<number>) => {
        const angleObservable = valueAccessor();

        if (!ko.isObservable(angleObservable)) {
            console.warn("Angle binding handler expects an observable.");
            return;
        }

        const behaviorOptions: AngleBehaviorOptions = {
            onChange: (newAngle: number) => {
                angleObservable(newAngle);
            }
        };

        const behaviorHandle = AngleBehavior.attach(element, behaviorOptions);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            if (behaviorHandle && behaviorHandle.detach) {
                behaviorHandle.detach();
            }
        });
    }
};