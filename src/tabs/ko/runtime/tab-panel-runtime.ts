import { coerce } from "@paperbits/common";
import { Events } from "@paperbits/common/events";

const activeContentTabClass = "tab-content-active";

export class TabPanelHTMLElement extends HTMLElement {
    private currentTabIndex: number;

    constructor() {
        super();
        const activeTabAttr = this.getAttribute("data-active-tab");

        this.currentTabIndex = !!activeTabAttr
            ? parseInt(activeTabAttr)
            : 0;
    }

    public static get observedAttributes(): string[] {
        return ["data-active-tab"];
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

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name !== "data-active-tab") {
            return;
        }

        switch (name) {
            case "data-active-tab":
                this.currentTabIndex = parseInt(newValue);
                this.setActiveItem(this.currentTabIndex);
                break;

            default:
                break;
        }
    }

    private onClick(event: MouseEvent): void {
        const element = <HTMLElement>event.target;
        const tabIndexIndex = element.getAttribute("data-tab");

        if (!tabIndexIndex) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        this.setAttribute("data-active-tab", tabIndexIndex.toString());
    }

    public connectedCallback(): void {
        this.addEventListener(Events.Click, this.onClick, true);
        setTimeout(() => this.setActiveItem(0), 10);
    }

    public disconnectedCallback(): void {
        this.removeEventListener(Events.Click, this.onClick, true);
    }
}
