import * as ko from "knockout";
import { ComponentFlow, IWidgetBinding, WidgetBinding, ComponentBinder } from "@paperbits/common/editing";
import { Bag } from "@paperbits/common";
import * as Arrays from "@paperbits/common";
import { ComponentDefinition } from "./componentDefinition";

export class KnockoutComponentBinder implements ComponentBinder {
    public init(element: Element, binding: WidgetBinding<any, any>): void {
        // console.log(binding);
        // ko.applyBindingsToNode(element, { kowidget: binding.componentBinderArgs }, null);
        ko.applyBindingsToNode(element, { kowidget: binding }, null);

        // const a = ko.contextFor(element);
        // debugger;
    }

    public dispose?(element: Element, binding: WidgetBinding<any, any>): void {

    }
}


export class KoWidgetBindingHandler {
    constructor() {
        let componentLoadingOperationUniqueId = 0;

        ko.bindingHandlers["kowidget"] = {
            init: function (element: any, valueAccessor: any, ignored1: any, ignored2: any, bindingContext: any): any {
                const bindingConfig = <WidgetBinding<any, any>>ko.utils.unwrapObservable(valueAccessor());

                if (!bindingConfig) {
                    console.warn("No binding config!");
                    return;
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
                    const componentViewModel = ko.utils.unwrapObservable(valueAccessor());

                    if (!componentViewModel) {
                        return;
                    }

                    // const registration = Reflect.getMetadata("paperbits-component", bindingConfig.constructor);
                    const registration = Reflect.getMetadata("paperbits-component", bindingConfig.componentBinderArgs);

                    if (!registration) {
                        throw new Error(`Could not find component registration for view model: ${bindingConfig}`);
                    }

                    const componentName = registration.name;

                    if (!componentName) {
                        throw new Error("No component name specified");
                    }

                    const componentParams = registration.params;

                    const asyncContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);

                    const loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;

                    /// const binding: IWidgetBinding<any, any> = componentViewModel["widgetBinding"];



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

                        const componentInfo = { element: element, templateNodes: originalChildNodes };

                        const componentViewModel = createViewModel(componentDefinition, componentParams, componentInfo),
                            childBindingContext = asyncContext["createChildContext"](componentViewModel, {
                                extend: function (ctx: any): any {
                                    ctx["$component"] = componentViewModel;
                                    ctx["$componentTemplateNodes"] = originalChildNodes;
                                }
                            });


                        if (bindingConfig && bindingConfig.onCreate) {
                            bindingConfig.viewModel = componentViewModel;
                            bindingConfig.onCreate(componentViewModel);
                        }

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

        function createViewModel(componentDefinition: ComponentDefinition, componentParams: any, componentInfo: any): any {
            const componentViewModelFactory = componentDefinition["createViewModel"];
            return componentViewModelFactory
                ? componentViewModelFactory.call(componentDefinition, componentParams, componentInfo)
                : componentParams; // Template-only component
        }

        ko.virtualElements.allowedBindings["kowidget"] = true;
    }
}
