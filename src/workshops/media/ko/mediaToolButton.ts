import { IToolButton, IViewManager, IView } from "@paperbits/common/ui";

export class MediaToolButton implements IToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-image-2";
    public readonly title: string = "Media";

    constructor(private readonly viewManager: IViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: IView = {
            heading: this.title,
            helpText: "Upload or edit files in the media library.",
            component: { name: "media" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}