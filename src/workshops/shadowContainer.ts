class ShadowContainer extends HTMLElement {
    constructor() {
        super();
        setTimeout(() => {
            const nodes = Array.prototype.slice.call(this.childNodes);
            const shadowRoot = this.attachShadow({ mode: "open" });
            nodes.forEach(node => {
                shadowRoot.appendChild(node);
            }, 1000);

        });
    }
}

customElements.define("shadow-container", ShadowContainer);