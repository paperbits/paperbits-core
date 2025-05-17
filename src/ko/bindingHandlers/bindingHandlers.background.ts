import * as ko from "knockout";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { BackgroundBehavior, BehaviorHandle } from "@paperbits/common/behaviors/behavior.background";

// ko.bindingHandlers["style"] = { ... }; // This global style binding handler remains unchanged.

export class BackgroundBindingHandler {
    constructor() { // StyleService removed as it was not used by this specific binding handler
        ko.bindingHandlers["background"] = {
            init(element: HTMLElement, valueAccessor: () => BackgroundModel | ko.Observable<BackgroundModel>): void {
                const configurationObservableOrModel = valueAccessor();
                let behaviorHandle: BehaviorHandle | undefined;

                // Helper to unwrap BackgroundModel properties if they are observable
                // This ensures the Behavior class receives plain data.
                const getCleanModel = (model?: BackgroundModel): BackgroundModel => {
                    if (!model) {
                        return {};
                    }
                    const cleanModel: BackgroundModel = {};
                    if (model.sourceUrl !== undefined) {
                        cleanModel.sourceUrl = ko.unwrap(model.sourceUrl);
                    }
                    if (model.color !== undefined) {
                        cleanModel.color = ko.unwrap(model.color);
                    }
                    // Add other properties from BackgroundModel if they can be observable and are used
                    return cleanModel;
                };

                if (ko.isObservable(configurationObservableOrModel)) {
                    const configurationObservable = configurationObservableOrModel as ko.Observable<BackgroundModel>;
                    
                    const initialModel = getCleanModel(ko.unwrap(configurationObservable));
                    behaviorHandle = BackgroundBehavior.attach(element, initialModel);

                    configurationObservable.subscribe((newConfiguration) => {
                        if (behaviorHandle?.update) {
                            behaviorHandle.update(getCleanModel(newConfiguration));
                        }
                    });
                } else {
                    const model = getCleanModel(configurationObservableOrModel as BackgroundModel);
                    behaviorHandle = BackgroundBehavior.attach(element, model);
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    if (behaviorHandle?.dispose) {
                        behaviorHandle.dispose();
                    }
                });
            }
        };
    }
}

