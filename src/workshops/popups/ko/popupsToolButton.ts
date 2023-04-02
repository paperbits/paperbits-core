import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

const helpText = `<h1>Popups</h1><p>Add or edit popups - floating windows shown on top of page content. It gets invoked and dismissed by user actions, like clicking or hovering over a link, button, map marker, etc.</p>`;

export class PopupsToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-polaroid";
    public readonly title: string = "Popups";
    public readonly tooltip: string = helpText;

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            helpText: helpText,
            component: { name: "popups" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}