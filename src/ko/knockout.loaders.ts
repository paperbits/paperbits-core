import * as ko from "knockout";
import { IInjector, IInjectorModule, InjectableMetadataKey } from "@paperbits/common/injection";
import { ComponentConfig } from "@paperbits/common/ko/decorators/component.decorator";
import { ComponentDefinition } from "./componentDefinition";


export class KnockoutRegistrationLoaders implements IInjectorModule {
    public register(injector: IInjector): void {
        const injectableComponentLoader = {
            loadViewModel(name: string, config: any, callback: (resolvedViewModel: any) => void): void {
                const injectable = Reflect.getMetadata(InjectableMetadataKey, config);

                if (!injectable) {
                    callback(null); // If no injectable metadata, let another loader handle it.
                    return;
                }

                const viewModelConstructor: any = function (params?: any): any {
                    const resolvedInjectable: any = injector.resolve(injectable.name);

                    let instance = resolvedInjectable;

                    if (resolvedInjectable.factory) {
                        instance = resolvedInjectable.factory(injector, params);
                    }

                    Object.getOwnPropertyNames(instance.constructor.prototype).forEach(prop => {
                        if (typeof instance[prop] === "function" && prop !== "constructor") {
                            instance[prop] = instance[prop].bind(instance);
                        }
                    });

                    const parameterDescriptions = Reflect.getMetadata("params", instance.constructor);

                    if (parameterDescriptions && params) {
                        /* Attempt to convert params string to object, otherwise it doesn't 
                         * make sense to iterate properties */

                        if (typeof params === "string") {
                            try {
                                params = eval(`(${params})`);
                            }
                            catch (error) {
                                // Do nothing
                            }
                        }

                        if (typeof params === "object") {
                            parameterDescriptions.forEach(parameterName => {
                                const instanceValue = instance[parameterName];
                                const paramerterValue = params[parameterName];

                                if (paramerterValue === undefined) {
                                    return;
                                }

                                if (ko.isObservable(instanceValue)) {
                                    if (ko.isObservable(paramerterValue)) {
                                        // Assigning initial value
                                        instanceValue(paramerterValue());

                                        let holdInstanceUpdate = false;
                                        let holdParameterUpdates = false;

                                        // Subscribing for all future changes
                                        paramerterValue.subscribe((value) => {
                                            if (holdInstanceUpdate) {
                                                return;
                                            }

                                            holdParameterUpdates = true;
                                            instanceValue(value);
                                            holdParameterUpdates = false;
                                        });

                                        instanceValue.subscribe(value => {
                                            if (holdParameterUpdates) {
                                                return;
                                            }

                                            holdInstanceUpdate = true;
                                            paramerterValue(value);
                                            holdInstanceUpdate = false;
                                        });
                                    }
                                    else {
                                        instanceValue(paramerterValue);
                                    }
                                }
                                else {
                                    instance[parameterName] = ko.unwrap(paramerterValue);
                                }
                            });
                        }
                    }

                    const eventDescriptions = Reflect.getMetadata("events", instance.constructor);

                    if (eventDescriptions) {
                        eventDescriptions.forEach(methodReference => {
                            if (params && params[methodReference]) {
                                instance[methodReference] = params[methodReference];
                            }
                            else {
                                console.warn(`Event "${methodReference}" in the component "${name}" doesn't have listeners.`);
                            }
                        });
                    }

                    const onMountedMethodDescriptions = Reflect.getMetadata("onmounted", instance.constructor);

                    if (onMountedMethodDescriptions) {
                        onMountedMethodDescriptions.forEach(methodDescription => {
                            const methodReference = instance[methodDescription];

                            if (methodReference) {
                                methodReference();
                            }
                        });
                    }

                    return instance;
                };

                ko.components.defaultLoader.loadViewModel(name, viewModelConstructor, callback);
            },

            loadTemplate(name: string, templateHtml: any, callback: (resolvedTemplate: Node[]) => void): void {
                const parseHtmlFragment = ko.utils.parseHtmlFragment;
                const nodes = parseHtmlFragment(templateHtml, document);

                ko.components.defaultLoader.loadTemplate(name, nodes, callback);
            },

            loadComponent(componentName: string, config: ComponentConfig, callback: (definition: ko.components.Component) => void): void {
                const callbackWrapper: (result: ko.components.Component) => void = (resultWrapper: ko.components.Component) => {

                    const createViewModelWrapper = (params: any, options: any) => {
                        const attrs: NamedNodeMap = options.element["attributes"];

                        if (attrs && attrs.length > 0) {
                            const runtimeParams = {};

                            for (const attr of Array.prototype.slice.call(attrs)) {
                                if (attr.name.startsWith("runtime-")) {
                                    const paramName = attr.name.split("-")[1];
                                    runtimeParams[paramName] = attr.value;
                                }
                            }

                            if (Object.keys(runtimeParams).length > 0) {
                                params = { ...runtimeParams, ...params };
                            }
                        }

                        return resultWrapper.createViewModel(params, options);
                    };

                    const definitionWrapper: ComponentDefinition = {
                        template: resultWrapper.template,
                        createViewModel: createViewModelWrapper,
                        constructor: config.constructor,
                        encapsulation: config.encapsulation
                    };

                    callback(definitionWrapper);
                };

                ko.components.defaultLoader.loadComponent(componentName, config, callbackWrapper);
            },
        };

        ko.components.loaders.unshift(injectableComponentLoader);

        ko.bindingProvider.instance.preprocessNode = (node: HTMLElement): Node[] => {
            if (node.removeAttribute) {
                const subscription = ko.bindingEvent.subscribe(node, "childrenComplete", () => {
                    node.removeAttribute("data-bind");
                    subscription.dispose();
                });
            }
            return null;
        };
    }
}
