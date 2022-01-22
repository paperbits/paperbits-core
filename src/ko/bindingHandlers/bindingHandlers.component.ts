import * as ko from "knockout";
import { ComponentDefinition } from "../componentDefinition";

const makeArray = (arrayLikeObject) => {
    const result = [];
    for (let i = 0, j = arrayLikeObject.length; i < j; i++) {
        result.push(arrayLikeObject[i]);
    }
    return result;
};

let componentLoadingOperationUniqueId = 0;

ko.bindingHandlers["component"] = {
    init: function (element: any, valueAccessor: any, ignored1: any, ignored2: any, bindingContext: any): any {
        let currentViewModel,
            currentLoadingOperationId,
            afterRenderSub;

        const disposeAssociatedComponentViewModel = function (): any {
            if (currentViewModel) {
                const onDestroyedMethodDescriptions = Reflect.getMetadata("ondestroyed", currentViewModel.constructor);

                if (onDestroyedMethodDescriptions) {
                    onDestroyedMethodDescriptions.forEach(methodDescription => {
                        const methodReference = currentViewModel[methodDescription];

                        if (methodReference) {
                            methodReference();
                        }
                    });
                }
                else {
                    const currentViewModelDispose = currentViewModel["dispose"];

                    if (typeof currentViewModelDispose === "function") {
                        currentViewModelDispose.call(currentViewModel);
                    }
                }
            }

            if (afterRenderSub) {
                afterRenderSub.dispose();
            }

            afterRenderSub = null;
            currentViewModel = null;
            // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
            currentLoadingOperationId = null;
        };

        const originalChildNodes = makeArray(ko.virtualElements.childNodes(element));

        ko.virtualElements.emptyNode(element);
        ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

        ko.computed(function (): void {
            const value = ko.utils.unwrapObservable(valueAccessor());
            let componentName, componentParams;

            if (typeof value === "string") {
                componentName = value;
            } else {
                componentName = ko.utils.unwrapObservable(value["name"]);
                componentParams = ko.utils.unwrapObservable(value["params"]);
            }

            if (!componentName) {
                throw new Error("No component name specified");
            }

            const asyncContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);

            const loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
            ko.components.get(componentName, function (componentDefinition: ComponentDefinition): any {
                // If this is not the current load operation for this element, ignore it.
                if (currentLoadingOperationId !== loadingOperationId) {
                    return;
                }

                // Clean up previous state
                disposeAssociatedComponentViewModel();

                // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                if (!componentDefinition) {
                    throw new Error("Unknown component '" + componentName + "'");
                }
                cloneTemplateIntoElement(componentName, componentDefinition, element);

                const componentInfo = {
                    element: element,
                    templateNodes: originalChildNodes
                };

                const componentViewModel = createViewModel(componentDefinition, componentParams, componentInfo),
                    childBindingContext = asyncContext["createChildContext"](componentViewModel, {
                        extend: function (ctx: any): any {
                            ctx["$component"] = componentViewModel;
                            ctx["$componentTemplateNodes"] = originalChildNodes;
                        }
                    });

                if (componentViewModel && componentViewModel["koDescendantsComplete"]) {
                    afterRenderSub = ko.bindingEvent.subscribe(element, ko.bindingEvent["descendantsComplete"], componentViewModel["koDescendantsComplete"], componentViewModel);
                }

                currentViewModel = componentViewModel;
                ko.applyBindingsToDescendants(childBindingContext, element);
            });
        }, null, { disposeWhenNodeIsRemoved: element });

        return { controlsDescendantBindings: true };
    }
};

ko.virtualElements.allowedBindings["component"] = true;

function cloneTemplateIntoElement(componentName: string, componentDefinition: ComponentDefinition, element: HTMLElement): any {
    const template = componentDefinition["template"];
    
    if (!template) {
        throw new Error(`Component "${componentName}" has no template.`);
    }

    const clonedNodesArray = ko.utils["cloneNodes"](template);
    ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
}

function createViewModel(componentDefinition: ComponentDefinition, componentParams: any, componentInfo: any): any {
    const componentViewModelFactory = componentDefinition["createViewModel"];
    return componentViewModelFactory
        ? componentViewModelFactory.call(componentDefinition, componentParams, componentInfo)
        : componentParams; // Template-only component
}
