import { IToolButton, IViewManager, IView } from "@paperbits/common/ui";

export class LayoutsToolButton implements IToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-layout-11-2";
    public readonly title: string = "Layouts";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: IView = {
            heading: this.title,
            helpText: "Add or edit layouts. Layouts let you centralize common content (e.g., navigation bar, footer), which will be applied to pages. Each page is automatically matched with a layout based on the URL template.",
            component: { name: "layouts" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}