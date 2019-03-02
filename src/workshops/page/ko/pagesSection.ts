import { IWorkshopSection, IViewManager } from "@paperbits/common/ui";

export class PagesWorkshopSection implements IWorkshopSection {
    public iconClass = "paperbits-icon paperbits-menu-left";
    public title = "Pages";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "pages"); // TODO: Specify IComponent rather than just name.
    }
}