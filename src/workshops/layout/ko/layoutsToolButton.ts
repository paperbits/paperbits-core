import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

export class LayoutsToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-layout-11-2";
    public readonly title: string = "Layouts";

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            helpText: "<h1>Layouts</h1><p>Add or edit layouts. Layouts let you centralize common content (e.g., navigation bar, footer), which will be applied to pages. Each page is automatically matched with a layout based on the URL template.</p>",
            component: { name: "layouts" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}