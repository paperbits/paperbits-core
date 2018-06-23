import * as ko from "knockout";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";

export class KnockoutRegistrationLoaders implements IInjectorModule {
    public register(injector: IInjector): void {
        var injectableComponentLoader = {
            loadViewModel(name, config, callback) {
                if (config.injectable) {
                    var viewModelConstructor = (params) => {
                        var resolvedInjectable: any = injector.resolve(config.injectable);

                        if (resolvedInjectable.factory) {
                            return resolvedInjectable.factory(injector, params);
                        }

                        return resolvedInjectable;
                    };

                    ko.components.defaultLoader.loadViewModel(name, viewModelConstructor, callback);
                }
                else {
                    // Unrecognized config format. Let another loader handle it.
                    callback(null);
                }
            },

            loadTemplate(name: string, templateHtml: any, callback: (result: Node[]) => void) {
                const parseHtmlFragment = <any>ko.utils.parseHtmlFragment;
                const nodes = parseHtmlFragment(templateHtml, document);

                ko.components.defaultLoader.loadTemplate(name, nodes, callback);
            },

            loadComponent(componentName: string, config: any, callback: (definition: KnockoutComponentTypes.Definition) => void) {
                var callbackWrapper: (result: KnockoutComponentTypes.Definition) => void = (resultWrapper: KnockoutComponentTypes.Definition) => {

                    var createViewModelWrapper: (params: any, options: { element: Node; }) => any = (params: any, options: { element: Node; }) => {
                        if (config.preprocess) {
                            config.preprocess(options.element, params);
                        }

                        var viewModel = resultWrapper.createViewModel(params, options);

                        if (config.postprocess) {
                            config.postprocess(options.element, viewModel);
                        }

                        return viewModel;
                    }

                    var definitionWrapper /*: KnockoutComponentTypes.Definition*/ = {
                        template: resultWrapper.template,
                        createViewModel: createViewModelWrapper,
                        constructor: config.constructor
                    };

                    callback(definitionWrapper);
                }

                ko.components.defaultLoader.loadComponent(componentName, config, callbackWrapper);
            },
        };

        ko.components.loaders.unshift(injectableComponentLoader);
    }
}