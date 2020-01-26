import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

export class BlogWorkshopToolButton implements ToolButton {
    public iconClass: string = "paperbits-icon paperbits-chat-45-2";
    public title: string = "Blog";

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            component: { name: "blogs" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}