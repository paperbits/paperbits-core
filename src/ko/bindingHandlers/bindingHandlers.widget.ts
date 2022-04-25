import * as ko from "knockout";
import { ComponentFlow, IWidgetBinding, WidgetBinding } from "@paperbits/common/editing";
import { ComponentBinder } from "@paperbits/common/editing/componentBinder";
import { Bag } from "@paperbits/common";
import { ComponentDefinition } from "../componentDefinition";


const makeArray = (arrayLikeObject) => {
    const result = [];
    for (let i = 0, j = arrayLikeObject.length; i < j; i++) {
        result.push(arrayLikeObject[i]);
    }
    return result;
};

export class WidgetBindingHandler {
    constructor(componentBinders: Bag<ComponentBinder>) {
        let componentLoadingOperationUniqueId = 0;

        ko.bindingHandlers["widget"] = {
            init: function (element: any, valueAccessor: any, ignored1: any, ignored2: any, bindingContext: any): any {
                const bindingConfig = ko.utils.unwrapObservable(valueAccessor());

                if (!bindingConfig) {
                    console.warn("No binding config!");
                    return;
                }


                let currentViewModel,
                    currentLoadingOperationId,
                    afterRenderSub;

                const disposeAssociatedComponentViewModel = function (): any {
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
                    const componentViewModel = ko.utils.unwrapObservable(valueAccessor());

                    if (!componentViewModel) {
                        return;
                    }

                    /* New binding logic */
                    if (bindingConfig instanceof WidgetBinding) {
                        const binding = <WidgetBinding<any, any>>bindingConfig;
                        const componentBinder = componentBinders[binding.framework];

                        if (!componentBinder) {
                            throw new Error(`No component binders registered for ${binding.framework} framework.`);
                        }

                        componentBinder.init(element, binding);

                        if (componentBinder.dispose) {
                            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                                componentBinder.dispose(element, binding);
                            });
                        }

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

                    if (!componentName) {
                        throw new Error("No component name specified");
                    }

                    const asyncContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);

                    const loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;

                    const binding: IWidgetBinding<any, any> = componentViewModel["widgetBinding"];

                    if (binding && binding.onCreate) {
                        binding.onCreate();
                    }

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


                        const childBindingContext = asyncContext["createChildContext"](componentViewModel, {
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

                        let nonVirtualElement: Node = element;

                        if (nonVirtualElement.nodeName.startsWith("#")) {
                            do {
                                nonVirtualElement = nonVirtualElement.nextSibling;
                            }
                            while (nonVirtualElement !== null && nonVirtualElement.nodeName.startsWith("#"));
                        }

                        if (nonVirtualElement) {
                            const binding: IWidgetBinding<any, any> = componentViewModel["widgetBinding"];

                            if (binding) {
                                ko.applyBindingsToNode(nonVirtualElement, {
                                    css: {
                                        "block": binding.flow === ComponentFlow.Block,
                                        "inline-block": binding.flow === ComponentFlow.Inline,
                                        "legacy": binding.flow === ComponentFlow.Legacy,
                                        "placeholder": binding.flow === ComponentFlow.Placeholder,
                                        "contents": binding.flow === ComponentFlow.Contents
                                    }
                                }, null);

                                componentViewModel["wrapped"] = binding.flow !== ComponentFlow.Contents;

                                if (binding.draggable) {
                                    ko.applyBindingsToNode(nonVirtualElement, { draggable: {} }, null);
                                }
                            }
                        }
                    });
                }, null, { disposeWhenNodeIsRemoved: element });

                return { controlsDescendantBindings: true };
            }
        };

        function cloneTemplateIntoElement(componentName: string, componentDefinition: ComponentDefinition, element: HTMLElement): any {
            const template = componentDefinition["template"];

            if (!template) {
                throw new Error(`Component "${componentName}" has no template.`);
            }

            const clonedNodesArray = ko.utils["cloneNodes"](template);
            ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
        }

        ko.virtualElements.allowedBindings["widget"] = true;
    }
}
