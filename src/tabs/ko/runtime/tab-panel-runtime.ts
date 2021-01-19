import { coerce } from "@paperbits/common";

export class TabPanelHTMLElement extends HTMLElement {
    constructor() {
        super();
    }

    private setActiveItem = (index: number) => {
        const activeTab = this.querySelector(".tab-content-active");

        if (activeTab) {
            activeTab.classList.remove("tab-content-active");
        }

        const activeLink = this.querySelector(".tab-navs .nav-link.nav-link-active");

        if (activeLink) {
            activeLink.classList.remove("nav-link-active");
        }

        setImmediate(() => {
            const tabPanel = coerce<HTMLDListElement>(this.querySelectorAll(".tab-content"));
            tabPanel[index].classList.add("tab-content-active");

            const navLinks = coerce<HTMLDListElement>(this.querySelectorAll(".tab-navs .nav-link"));
            navLinks[index].classList.add("nav-link-active");
        });
    };

    private onClick(event: MouseEvent): void {
        const element = <HTMLElement>event.target;
        const tabIndexIndex = element.getAttribute("data-tab");

        if (!tabIndexIndex) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        this.setActiveItem(parseInt(tabIndexIndex));
    }

    public connectedCallback(): void {
        this.addEventListener("click", this.onClick, true);
        setTimeout(() => this.setActiveItem(0), 10);
    }

    public disconnectedCallback(): void {
        this.removeEventListener("click", this.onClick, true);
    }
}
