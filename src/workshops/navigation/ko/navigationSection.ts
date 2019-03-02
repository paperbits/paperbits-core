import { IWorkshopSection, IViewManager } from "@paperbits/common/ui";

export class NavigationWorkshopSection implements IWorkshopSection {
    public iconClass = "paperbits-icon paperbits-menu-34";
    public title = "Navigation";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "navigation"); // TODO: Specify IComponent rather than just name.
    }
}