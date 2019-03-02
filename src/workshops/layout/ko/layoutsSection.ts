import { IWorkshopSection, IViewManager } from "@paperbits/common/ui";

export class LayoutsWorkshopSection implements IWorkshopSection {
    public iconClass = "paperbits-icon paperbits-layout-11";
    public title = "Layouts";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "layouts"); // TODO: Specify IComponent rather than just name.
    }
}