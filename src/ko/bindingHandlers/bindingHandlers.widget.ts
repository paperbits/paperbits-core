import * as ko from "knockout";
import { IWidgetBinding, WidgetBinding } from "@paperbits/common/editing";
import { ReactComponentBinder } from "@paperbits/common/react/reactComponentBinder";
// import { KnockoutComponentBinder } from "@paperbits/common/ko/knockoutComponentBinder";
import { ComponentBinder } from "@paperbits/common/editing/componentBinder";


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

const cloneTemplateIntoElement = (componentDefinition: any, element: any): HTMLElement => {
    const template = componentDefinition["template"];

    if (!template) {
        return element;
    }

    const clonedNodesArray = cloneNodes(template, false);
    ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
    return element;
};


export class WidgetBindingHandler {
    public constructor() {
        let componentLoadingOperationUniqueId = 0;

        ko.bindingHandlers["widget"] = {
            init(element: Element, valueAccessor: any, ignored1: any, ignored2: any, bindingContext: ko.BindingContext): any {
                const bindingConfig = ko.utils.unwrapObservable(valueAccessor());

                if (!bindingConfig) {
                    return;
                }

                /* New  binding logic */
                if (bindingConfig instanceof WidgetBinding) {
                    const binding = <WidgetBinding>bindingConfig;

                    let componentBinder: ComponentBinder;

                    switch (binding.framework) {
                        case "react":
                            componentBinder = new ReactComponentBinder();
                            break;
                    }

                    componentBinder.init(<HTMLElement>element, binding);

                    if (binding.draggable) {
                        ko.applyBindingsToNode(element, { draggable: {} }, null);
                    }

                    return;
                }

                /* Legacy binding logic */
                const registration = Reflect.getMetadata("paperbits-component", bindingConfig.constructor);

                if (!registration) {
                    throw new Error(`Could not find component registration for view model: ${bindingConfig}`);
                }

                const componentName = registration.name;

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
                    const binding: IWidgetBinding<any> = componentViewModel["widgetBinding"];

                    if (binding && binding.onCreate) {
                        binding.onCreate();
                    }

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
                        const root = cloneTemplateIntoElement(componentDefinition, element);

                        const childBindingContext = bindingContext["createChildContext"](componentViewModel, /* dataItemAlias */ undefined, ctx => {
                            ctx["$component"] = componentViewModel;
                            ctx["$componentTemplateNodes"] = originalChildNodes;
                        });

                        currentViewModel = componentViewModel;
                        ko.applyBindingsToDescendants(childBindingContext, root);

                        let nonVirtualElement: Node = element;

                        if (nonVirtualElement.nodeName.startsWith("#")) {
                            do {
                                nonVirtualElement = nonVirtualElement.nextSibling;
                            }
                            while (nonVirtualElement !== null && nonVirtualElement.nodeName.startsWith("#"));
                        }

                        if (nonVirtualElement) {
                            nonVirtualElement["attachedViewModel"] = componentViewModel;

                            const binding: IWidgetBinding<any> = componentViewModel["widgetBinding"];

                            if (binding) {
                                ko.applyBindingsToNode(nonVirtualElement, {
                                    css: {
                                        "block": binding.flow === "block",
                                        "inline-block": binding.flow === "inline",
                                        "fit": binding.flow === "none"
                                    }
                                }, null);

                                if (binding.draggable) {
                                    ko.applyBindingsToNode(nonVirtualElement, { draggable: {} }, null);
                                }
                            }
                        }
                    });
                }, null, { disposeWhenNodeIsRemoved: element });

                return { controlsDescendantBindings: false };
            }
        };

        ko.virtualElements.allowedBindings["widget"] = true;
    }
}