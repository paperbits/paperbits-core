import { IToolButton, IViewManager, IView } from "@paperbits/common/ui";

export class NavigationToolButton implements IToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-menu-34";
    public readonly title: string = "Navigation";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: IView = {
            heading: this.title,
            helpText: "Add or edit navigation menus.",
            component: { name: "navigation" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}