import { IToolButton, IViewManager, IView } from "@paperbits/common/ui";

export class PagesToolButton implements IToolButton {
    public iconClass: string = "paperbits-icon paperbits-menu-left";
    public title: string = "Pages";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: IView = {
            heading: this.title,
            helpText: "Add or edit pages of your website. Each page has a unique URL, which also automatically defines the layout it is part of.",
            component: { name: "pages" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}