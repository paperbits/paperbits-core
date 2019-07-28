import { IToolButton, IViewManager, IView } from "@paperbits/common/ui";

export class BlogWorkshopToolButton implements IToolButton {
    public iconClass: string = "paperbits-icon paperbits-chat-45-2";
    public title: string = "Blog";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: IView = {
            heading: this.title,
            component: { name: "page-details-workshop" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}