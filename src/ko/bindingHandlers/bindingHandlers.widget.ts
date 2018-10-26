import * as ko from "knockout";

export class WidgetBindingHandler {
    public constructor() {
        let componentLoadingOperationUniqueId = 0;

        ko.bindingHandlers["widget"] = {
            init(element, valueAccessor, ignored1, ignored2, bindingContext) {
                const abc = ko.utils.unwrapObservable(valueAccessor());

                if (!abc) {
                    return;
                }

                let currentViewModel;
                let currentLoadingOperationId;

                const disposeAssociatedComponentViewModel = () => {
                    const currentViewModelDispose = currentViewModel && currentViewModel["dispose"];

                    if (currentViewModel) {
                        const binding = currentViewModel["widgetBinding"];

                        if (binding && binding.onDispose) {
                            binding.onDispose();
                        }
                    }

                    if (typeof currentViewModelDispose === "function") {
                        currentViewModelDispose.call(currentViewModel);
                    }
                    currentViewModel = null;
                    // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
                    currentLoadingOperationId = null;


                };
                const originalChildNodes = makeArray(ko.virtualElements.childNodes(element));

                ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

                ko.computed(() => {
                    const componentViewModel = ko.utils.unwrapObservable(valueAccessor());

                    if (!componentViewModel) {
                        return;
                    }

                    const loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;

                    const registration  = Reflect.getMetadata("knockout-component", componentViewModel.constructor);

                    if (!registration) {
                        throw new Error(`Could not find component registration for view model: ${componentViewModel}`);
                    }

                    const binding = componentViewModel["widgetBinding"];

                    if (binding && binding.onCreate) {
                        binding.onCreate();
                    }

                    const componentName = registration.name;

                    ko.components.get(componentName, componentDefinition => {
                        // If this is not the current load operation for this element, ignore it.
                        if (currentLoadingOperationId !== loadingOperationId) {
                            return;
                        }

                        // Clean up previous state
                        disposeAssociatedComponentViewModel();

                        // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                        if (!componentDefinition) {
                            throw new Error(`Unknown component "${componentName}".`);
                        }
                        const root = cloneTemplateIntoElement(componentName, componentDefinition, element, !!(<any>componentDefinition).shadow);

                        const childBindingContext = bindingContext["createChildContext"](componentViewModel, /* dataItemAlias */ undefined, ctx => {
                            ctx["$component"] = componentViewModel;
                            ctx["$componentTemplateNodes"] = originalChildNodes;
                        });

                        currentViewModel = componentViewModel;
                        ko.applyBindingsToDescendants(childBindingContext, root);

                        let correctedElement = element;

                        if (correctedElement.nodeName === "#comment") {
                            do {
                                correctedElement = correctedElement.nextSibling;
                            }
                            while (correctedElement !== null && correctedElement.nodeName === "#comment");
                        }

                        if (correctedElement) {
                            correctedElement["attachedViewModel"] = componentViewModel;

                            ko.applyBindingsToNode(correctedElement, { layoutwidget: {} });
                        }
                    });
                }, null, { disposeWhenNodeIsRemoved: element });

                return { controlsDescendantBindings: false };
            }
        };

        ko.virtualElements.allowedBindings["widget"] = true;

        const makeArray = (arrayLikeObject) => {
            const result = [];
            for (let i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            }
            return result;
        };

        const cloneNodes = (nodesArray, shouldCleanNodes) => {
            const newNodesArray = [];

            for (let i = 0, j = nodesArray.length; i < j; i++) {
                const clonedNode = nodesArray[i].cloneNode(true);
                newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
            }
            return newNodesArray;
        };

        function cloneTemplateIntoElement(componentName, componentDefinition, element, useShadow: boolean): HTMLElement {
            const template = componentDefinition["template"];

            if (!template) {
                return element;
            }

            const clonedNodesArray = cloneNodes(template, false);
            ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
            return element;
        }

        function createViewModel(componentDefinition, element, originalChildNodes, componentParams) {
            const componentViewModelFactory = componentDefinition["createViewModel"];
            return componentViewModelFactory
                ? componentViewModelFactory.call(componentDefinition, componentParams, { element: element, templateNodes: originalChildNodes })
                : componentParams; // Template-only component
        }
    }
}