import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

const helpText = "<h1>Site settings</h1><p>Edit your website metadata.</p>";

export class SettingsToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-preferences-circle";
    public readonly title: string = "Settings";
    public readonly tooltip: string = helpText;

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            helpText: helpText,
            component: { name: "settings" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}