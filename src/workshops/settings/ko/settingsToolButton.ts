import { IToolButton, IViewManager } from "@paperbits/common/ui";

export class SettingsToolButton implements IToolButton {
    public iconClass: string = "paperbits-icon paperbits-preferences-circle";
    public title: string = "Settings";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "settings"); // TODO: Specify IComponent rather than just name.
    }
}