import * as ko from "knockout";
import * as Arrays from "@paperbits/common";
import { WidgetBinding, ComponentBinder, ComponentFlow } from "@paperbits/common/editing";
import { ComponentDefinition } from "./componentDefinition";


function getNonVirtualElement(element: Node): HTMLElement {
    let nonVirtualElement: Node = element;

    if (nonVirtualElement.nodeName.startsWith("#")) {
        do {
            nonVirtualElement = nonVirtualElement.nextSibling;
        }
        while (nonVirtualElement !== null && nonVirtualElement.nodeName.startsWith("#"));
    }

    if (!nonVirtualElement) {
        return null;
    }

    return <HTMLElement>nonVirtualElement;
}

export class KnockoutComponentBinder implements ComponentBinder {
    constructor() {
        let componentLoadingOperationUniqueId = 0;

        ko.bindingHandlers["knockoutWidget"] = {
            init: function (element: any, valueAccessor: any, ignored1: any, ignored2: any, bindingContext: any): any {
                const widgetBinding = <WidgetBinding<any, any>>ko.utils.unwrapObservable(valueAccessor());

                bindingContext = ko.contextFor(element); // restoring context broken by the ko.applyBindingsToNode in init() method

                if (!widgetBinding) {
                    console.warn("No binding config!");
                    return;
                }

                let currentViewModel,
                    currentLoadingOperationId,
                    afterRenderSub;

                const disposeAssociatedComponentViewModel = function (): void {
                    const currentViewModelDispose = currentViewModel && currentViewModel["dispose"];

                    if (currentViewModel) {
                        if (widgetBinding && widgetBinding.onDispose) {
                            widgetBinding.onDispose();
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

                    const registration = Reflect.getMetadata("paperbits-component", widgetBinding.componentDefinition);

                    if (!registration) {
                        throw new Error(`Could not find component registration for ${widgetBinding.name} widget. Ensure that "@Component" decorator is added on widget view model class.`);
                    }

                    const componentName = registration.name;

                    if (!componentName) {
                        throw new Error("No component name specified");
                    }

                    const componentParams = registration.params;
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

                        const componentInfo = { element: element, templateNodes: originalChildNodes };
                        const componentViewModel = createViewModel(componentDefinition, componentParams, componentInfo);

                        componentViewModel["widgetBinding"] = widgetBinding;

                        const childBindingContext = asyncContext["createChildContext"](componentViewModel, {
                            extend: function (ctx: any): any {
                                ctx["$component"] = componentViewModel;
                                ctx["$componentTemplateNodes"] = originalChildNodes;
                            }
                        });

                        if (widgetBinding && widgetBinding.onCreate) {
                            widgetBinding.viewModel = componentViewModel;
                            widgetBinding.onCreate(componentViewModel);
                        }

                        if (componentViewModel && componentViewModel["koDescendantsComplete"]) {
                            afterRenderSub = ko.bindingEvent.subscribe(element, ko.bindingEvent["descendantsComplete"], componentViewModel["koDescendantsComplete"], componentViewModel);
                        }

                        currentViewModel = componentViewModel;
                        ko.applyBindingsToDescendants(childBindingContext, element);

                        const nonVirtualElement = getNonVirtualElement(element);

                        if (nonVirtualElement) {
                            ko.applyBindingsToNode(nonVirtualElement, {
                                css: {
                                    "block": widgetBinding.wrapper === ComponentFlow.Block,
                                    "inline-block": widgetBinding.wrapper === ComponentFlow.Inline,
                                    "legacy": widgetBinding.wrapper === ComponentFlow.Legacy,
                                    "placeholder": widgetBinding.wrapper === ComponentFlow.Placeholder
                                }
                            }, null);

                            if (widgetBinding.draggable) {
                                ko.applyBindingsToNode(nonVirtualElement, { draggable: {} }, null);
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

        ko.virtualElements.allowedBindings["knockoutWidget"] = true;
    }

    public init(element: Element, binding: WidgetBinding<any, any>): void {
        ko.applyBindingsToNode(element, { knockoutWidget: binding }, null);
        // Method onCreate() is called from knockoutWidget binding handler.
    }

    public dispose?(element: Element, binding: WidgetBinding<any, any>): void {
        // Method onDispose() is called from knockoutWidget binding handler.
    }
}