import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

const helpText = "<h1>URLs</h1><p>Add or edit URLs pointing to external resources.</p>";

export class UrlsToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-link-69-2";
    public readonly title: string = "URLs";
    public readonly tooltip: string = helpText;

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            helpText: helpText,
            component: { name: "urls" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}