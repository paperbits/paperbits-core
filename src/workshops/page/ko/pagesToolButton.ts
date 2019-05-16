import { IToolButton, IViewManager } from "@paperbits/common/ui";

export class PagesToolButton implements IToolButton {
    public iconClass: string = "paperbits-icon paperbits-menu-left";
    public title: string = "Pages";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "pages"); // TODO: Specify IComponent rather than just name.
    }
}