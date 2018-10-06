import * as ko from "knockout";

let componentLoadingOperationUniqueId = 0;

ko.bindingHandlers["component"] = {
    init: (element: HTMLElement, valueAccessor, ignored1, ignored2, bindingContext) => {
        let currentViewModel;
        let currentLoadingOperationId;
        const disposeAssociatedComponentViewModel = () => {
            const currentViewModelDispose = currentViewModel && currentViewModel["dispose"];

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
            let componentOnCreateHandler;
            const value = ko.utils.unwrapObservable(valueAccessor());
            let componentName, componentParams;

            if (typeof value === "string") {
                componentName = value;
            } else {
                componentName = ko.utils.unwrapObservable(value["name"]);
                componentParams = ko.utils.unwrapObservable(value["params"]);
                componentOnCreateHandler = ko.utils.unwrapObservable(value["oncreate"]);
            }

            if (!componentName) {
                throw new Error("No component name specified");
            }

            const loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;

            ko.components.get(componentName, componentDefinition => {
                // If this is not the current load operation for this element, ignore it.
                if (currentLoadingOperationId !== loadingOperationId) {
                    return;
                }

                // Clean up previous state
                disposeAssociatedComponentViewModel();

                // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                if (!componentDefinition) {
                    throw new Error(`Unknown component "${componentName}"`);
                }

                const root = cloneTemplateIntoElement(componentName, componentDefinition, element, !!(<any>componentDefinition).shadow);
                const componentViewModel = createViewModel(componentDefinition, root, originalChildNodes, componentParams),
                    childBindingContext = bindingContext["createChildContext"](componentViewModel, /* dataItemAlias */ undefined, ctx => {
                        ctx["$component"] = componentViewModel;
                        ctx["$componentTemplateNodes"] = originalChildNodes;
                    });
                currentViewModel = componentViewModel;

                ko.applyBindingsToDescendants(childBindingContext, root);

                if (componentOnCreateHandler) {
                    componentOnCreateHandler(componentViewModel, element);
                }
            });
        }, null, { disposeWhenNodeIsRemoved: element });

        return { controlsDescendantBindings: true };
    }
};

ko.virtualElements.allowedBindings["component"] = true;

const makeArray = (arrayLikeObject) => {
    const result = [];
    for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
        result.push(arrayLikeObject[i]);
    }
    return result;
};

var cloneNodes = (nodesArray, shouldCleanNodes) => {
    for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
        var clonedNode = nodesArray[i].cloneNode(true);
        newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
    }
    return newNodesArray;
};

function cloneTemplateIntoElement(componentName, componentDefinition, element, useShadow: boolean): HTMLElement {
    var template = componentDefinition["template"];

    if (!template) {
        return element;
    }

    var clonedNodesArray = cloneNodes(template, false);
    ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
    return element;
}

function createViewModel(componentDefinition, element, originalChildNodes, componentParams) {
    var componentViewModelFactory = componentDefinition["createViewModel"];
    return componentViewModelFactory
        ? componentViewModelFactory.call(componentDefinition, componentParams, { "element": element, "templateNodes": originalChildNodes })
        : componentParams; // Template-only component
}

