import { IWorkshopSection, IViewManager } from "@paperbits/common/ui";

export class MediaWorkshopSection implements IWorkshopSection {
    public iconClass = "paperbits-icon paperbits-image-2";
    public title = "Media";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "media"); // TODO: Specify IComponent rather than just name.
    }
}