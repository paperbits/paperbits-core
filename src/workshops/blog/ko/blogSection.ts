import { IWorkshopSection, IViewManager } from "@paperbits/common/ui";

export class BlogWorkshopSection implements IWorkshopSection {
    public iconClass = "paperbits-icon paperbits-chat-45-2";
    public title = "Blog";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "blogs"); // TODO: Specify IComponent rather than just name.
    }
}