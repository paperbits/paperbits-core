import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

const helpText = "<h1>Layouts</h1><p>Add or edit layouts. Layouts let you centralize common content (e.g., navigation bar, footer), which will be applied to pages. Each page is automatically matched with a layout based on the URL template.</p>";

export class LayoutsToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-layout-11-2";
    public readonly title: string = "Layouts";
    public readonly tooltip: string = helpText;

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            helpText: helpText,
            component: { name: "layouts" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}