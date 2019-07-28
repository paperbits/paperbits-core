import { IToolButton, IViewManager, IView } from "@paperbits/common/ui";

export class SettingsToolButton implements IToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-preferences-circle";
    public readonly title: string = "Settings";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: IView = {
            heading: this.title,
            helpText: "Edit your website metadata.",
            component: { name: "settings" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}