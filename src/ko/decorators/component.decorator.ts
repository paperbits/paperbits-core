import * as ko from "knockout";

export interface ComponentConfig {
    selector: string;
    template: string;
    injectable?: string;
    postprocess?: (element: Node, viewModel) => void;
}

export function Component(config: ComponentConfig) {
    return function (target) {
        ko.components.register(config.selector, {
            template: config.template,
            viewModel: { injectable: config.injectable || target.name },
            postprocess: config.postprocess,
            synchrounous: true
        });

        Reflect.defineMetadata("knockout-component", { name: config.selector, constructor: target }, target);
    };
} 