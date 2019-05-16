import { IToolButton, IViewManager } from "@paperbits/common/ui";

export class NavigationToolButton implements IToolButton {
    public iconClass: string = "paperbits-icon paperbits-menu-34";
    public title: string = "Navigation";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "navigation"); // TODO: Specify IComponent rather than just name.
    }
}