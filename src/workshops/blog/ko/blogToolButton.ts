import { IToolButton, IViewManager } from "@paperbits/common/ui";

export class BlogWorkshopToolButton implements IToolButton {
    public iconClass: string = "paperbits-icon paperbits-chat-45-2";
    public title: string = "Blog";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "blogs"); // TODO: Specify IComponent rather than just name.
    }
}