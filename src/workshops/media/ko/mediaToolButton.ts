import { IToolButton, IViewManager } from "@paperbits/common/ui";

export class MediaToolButton implements IToolButton {
    public iconClass: string = "paperbits-icon paperbits-image-2";
    public title: string = "Media";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(this.title, "media"); // TODO: Specify IComponent rather than just name.
    }
}