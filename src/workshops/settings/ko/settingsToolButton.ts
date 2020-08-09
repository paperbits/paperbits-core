import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

export class SettingsToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-preferences-circle";
    public readonly title: string = "Settings";

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            helpText: "<h1>Site settings</h1><p>Edit your website metadata.</p>",
            component: { name: "settings" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}