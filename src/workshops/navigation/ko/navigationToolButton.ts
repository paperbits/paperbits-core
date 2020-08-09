import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

export class NavigationToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-menu-34";
    public readonly title: string = "Navigation";

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            helpText: "<h1>Navigation</h1><p>Add or edit navigation menus.</p>",
            component: { name: "navigation" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}