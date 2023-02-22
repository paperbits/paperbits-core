import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

const helpText = "<h1>External URLs</h1><p>Add or edit external URLs of your website.</p>";

export class UrlsToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-link-69-2";
    public readonly title: string = "External URLs";
    public readonly tooltip: string = helpText;

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            helpText: helpText,
            component: { name: "url-selector" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}