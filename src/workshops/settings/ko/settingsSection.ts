import { IWorkshopSection, IViewManager } from "@paperbits/common/ui";

export class SettingsWorkshopSection implements IWorkshopSection {
    public iconClass = "paperbits-icon paperbits-preferences-circle";
    public title = "Settings";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "settings"); // TODO: Specify IComponent rather than just name.
    }
}