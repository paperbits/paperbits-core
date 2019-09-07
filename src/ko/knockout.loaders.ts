import * as ko from "knockout";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { ComponentConfig } from "@paperbits/common/ko/decorators/component.decorator";
import { ComponentDefinition } from "./bindingHandlers/bindingHandlers.component";

export class KnockoutRegistrationLoaders implements IInjectorModule {
    public register(injector: IInjector): void {
        const injectableComponentLoader = {
            loadViewModel(name: string, config: ComponentConfig, callback: Function): void {
                if (config.injectable) {
                    const viewModelConstructor = (params) => {
                        const resolvedInjectable: any = injector.resolve(config.injectable);

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

                                    const paramerterValue = params[parameterName] || params[parameterName.toLowerCase()];

                                    if (ko.isObservable(instanceValue)) {
                                        if (ko.isObservable(paramerterValue)) {
                                            // Assigning initial value
                                            instanceValue(paramerterValue());

                                            // Subscribing for all future changes
                                            paramerterValue.subscribe((value) => {
                                                instanceValue(value);
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
                                instance[methodReference] = params[methodReference];
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

                        const onDestroyedMethodDescriptions = Reflect.getMetadata("ondestroyed", instance.constructor);

                        if (onDestroyedMethodDescriptions) {
                            onDestroyedMethodDescriptions.forEach(methodDescription => {
                                const methodReference = instance[methodDescription];

                                if (methodReference) {
                                    methodReference();
                                }
                            });
                        }

                        return instance;
                    };

                    (<any>ko.components.defaultLoader).loadViewModel(name, viewModelConstructor, callback);
                }
                else {
                    // Unrecognized config format. Let another loader handle it.
                    callback(null);
                }
            },

            loadTemplate(name: string, templateHtml: any, callback: (result: Node[]) => void): void {
                const parseHtmlFragment = <any>ko.utils.parseHtmlFragment;
                const nodes = parseHtmlFragment(templateHtml, document);

                (<any>ko.components.defaultLoader).loadTemplate(name, nodes, callback);
            },

            loadComponent(componentName: string, config: ComponentConfig, callback: (definition: KnockoutComponentTypes.Definition) => void): void {
                const callbackWrapper: (result: KnockoutComponentTypes.Definition) => void = (resultWrapper: KnockoutComponentTypes.Definition) => {

                    const createViewModelWrapper: (params: any, options: { element: Node; }) => any = (params: any, options: { element: Node; }) => {
                        const attrs: NamedNodeMap = options.element["attributes"];
                        if (attrs && attrs.length > 0) {
                            const runtimeParams = {};

                            for (let i = 0; i < attrs.length; i++) {
                                const attr: Attr = attrs[i];
                                if (attr.name.startsWith("runtime-")) {
                                    const paramName = attr.name.split("-")[1];
                                    runtimeParams[paramName] = attr.value;
                                }
                            }
                            if (Object.keys(runtimeParams).length > 0) {
                                params = {...runtimeParams, ...params};
                            }
                        }

                        const viewModel = resultWrapper.createViewModel(params, options);

                        if (config.postprocess) {
                            config.postprocess(options.element, viewModel);
                        }

                        return viewModel;
                    };

                    const definitionWrapper: ComponentDefinition = {
                        template: resultWrapper.template,
                        createViewModel: createViewModelWrapper,
                        constructor: config.constructor,
                        encapsulation: config.encapsulation
                    };

                    callback(definitionWrapper);
                };

                (<any>ko.components.defaultLoader).loadComponent(componentName, config, callbackWrapper);
            },
        };

        ko.components.loaders.unshift(injectableComponentLoader);
    }
}