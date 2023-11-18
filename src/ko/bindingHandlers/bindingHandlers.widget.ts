import * as ko from "knockout";
import * as Arrays from "@paperbits/common";
import { IWidgetBinding, WidgetBinding } from "@paperbits/common/editing";
import { ComponentDefinition } from "../componentDefinition";
import { KnockoutComponentBinder } from "../knockoutComponentBinder";
import { ComponentFlow } from "@paperbits/common/components";


export class WidgetBindingHandler {
    constructor() {
        let componentLoadingOperationUniqueId = 0;

        ko.bindingHandlers["widget"] = {
            init: function (element: any, valueAccessor: any, ignored1: any, ignored2: any, bindingContext: any): any {
                const bindingConfig = ko.utils.unwrapObservable(valueAccessor());

                if (!bindingConfig) {
                    console.warn("No binding config!");
                    return;
                }

                /* New binding logic */
                if (bindingConfig instanceof WidgetBinding && !(bindingConfig.componentBinder instanceof KnockoutComponentBinder)) {
                    const binding = <WidgetBinding<any, any>>bindingConfig;
                    const componentBinder = binding.componentBinder;

                    if (!componentBinder) {
                        throw new Error(`No component binders registered for ${binding.framework} framework. Binding: ${binding.name}`);
                    }

                    componentBinder
                        .bind(element, binding.componentDefinition)
                        .then(componentInstance => {
                            binding.viewModel = componentInstance;
                            binding.onCreate(componentInstance);
                        });

                    if (binding.draggable) {
                        let nonVirtualElement: Node = getNonVirtualElement(element);

                        if (nonVirtualElement) {
                            ko.applyBindingsToNode(nonVirtualElement, { draggable: {} }, null);
                        }
                    }

                    if (componentBinder.unbind) {
                        ko.utils.domNodeDisposal.addDisposeCallback(element, () => componentBinder.unbind(element));
                    }

                    return { controlsDescendantBindings: true };
                }

                let currentViewModel,
                    currentLoadingOperationId,
                    afterRenderSub;

                const disposeAssociatedComponentViewModel = function (): void {
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

                const originalChildNodes = Arrays.coerce(ko.virtualElements.childNodes(element));

                ko.virtualElements.emptyNode(element);
                ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

                ko.computed(function (): void {
                    const bindingOrViewModel = ko.utils.unwrapObservable(valueAccessor());

                    if (!bindingOrViewModel) {
                        return;
                    }

                    let componentViewModel: any;

                    if (!(bindingOrViewModel instanceof WidgetBinding)) {
                        componentViewModel = bindingOrViewModel;
                    }

                    /* Legacy binding logic */

                    const constructor = bindingConfig.componentDefinition || bindingConfig.constructor;

                    const registration = Reflect.getMetadata("paperbits-component", constructor);

                    if (!registration) {
                        throw new Error(`Could not find component registration for view model: ${bindingConfig}`);
                    }

                    const componentName = registration.name;

                    if (!componentName) {
                        throw new Error("No component name specified");
                    }

                    const asyncContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);
                    const loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                    const binding: IWidgetBinding<any, any> = bindingOrViewModel["widgetBinding"] || bindingConfig;

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

                        let childBindingContext: ko.BindingContext<any>;

                        if (componentViewModel) {
                            childBindingContext = asyncContext["createChildContext"](componentViewModel, {
                                extend: function (ctx: any): any {
                                    ctx["$component"] = componentViewModel;
                                    ctx["$componentTemplateNodes"] = originalChildNodes;
                                }
                            });
                        }
                        else {
                            const componentParams = ko.utils.unwrapObservable(bindingOrViewModel["params"]);
                            const componentInfo = { element: element, templateNodes: originalChildNodes };

                            componentViewModel = createViewModel(componentDefinition, componentParams, componentInfo),
                                childBindingContext = asyncContext["createChildContext"](componentViewModel, {
                                    extend: function (ctx: any): any {
                                        ctx["$component"] = componentViewModel;
                                        ctx["$componentTemplateNodes"] = originalChildNodes;
                                    }
                                });

                            componentViewModel["widgetBinding"] = binding;
                        }

                        if (componentViewModel && componentViewModel["koDescendantsComplete"]) {
                            afterRenderSub = ko.bindingEvent.subscribe(element, ko.bindingEvent["descendantsComplete"], componentViewModel["koDescendantsComplete"], componentViewModel);
                        }

                        currentViewModel = componentViewModel;

                        if (binding && binding.onCreate) {
                            binding["viewModel"] = currentViewModel;
                            binding.onCreate(currentViewModel);
                        }

                        ko.applyBindingsToDescendants(childBindingContext, element);

                        let nonVirtualElement: Node = getNonVirtualElement(element);

                        if (nonVirtualElement) {
                            if (binding) {
                                ko.applyBindingsToNode(nonVirtualElement, {
                                    css: {
                                        "block": binding.flow === ComponentFlow.Block,
                                        "inline-block": binding.flow === ComponentFlow.Inline,
                                        "legacy": binding.flow === ComponentFlow.Legacy,
                                        "placeholder": binding.flow === ComponentFlow.Placeholder
                                    }
                                }, null);

                                componentViewModel["wrapped"] = binding.flow !== ComponentFlow.None;

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

        function createViewModel(componentDefinition: ComponentDefinition, componentParams: any, componentInfo: any): any {
            const componentViewModelFactory = componentDefinition["createViewModel"];
            return componentViewModelFactory
                ? componentViewModelFactory.call(componentDefinition, componentParams, componentInfo)
                : componentParams; // Template-only component
        }

        function getNonVirtualElement(element: Node): HTMLElement {
            let nonVirtualElement: Node = element;

            if (nonVirtualElement.nodeName.startsWith("#")) {
                do {
                    nonVirtualElement = nonVirtualElement.nextSibling;
                }
                while (nonVirtualElement !== null && nonVirtualElement.nodeName.startsWith("#"));
            }

            return <HTMLElement>nonVirtualElement;
        }

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
