// import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter";
// import "@webcomponents/webcomponentsjs/webcomponents-bundle";

export function RuntimeComponent(config) {
    return (target) => {
        ko.components.register(config.selector, {
            template: config.template,
            viewModel: target
        });

        class RuntimeComponentProxy extends HTMLElement {
            constructor() {
                super();
                ko.applyBindingsToNode(this, { component: { name: config.selector } })
            }
        }

        customElements.define(config.selector, RuntimeComponentProxy);
    };
} 