import { ToolButton, ViewManager, View } from "@paperbits/common/ui";

export class MediaToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-image-2";
    public readonly title: string = "Media";

    constructor(private readonly viewManager: ViewManager) { }

    public onActivate(): void {
        this.viewManager.clearJourney();

        const view: View = {
            heading: this.title,
            helpText: "<h1>Media library</h1><p>Upload or edit files in the media library.</p>",
            component: { name: "media" }
        };

        this.viewManager.openViewAsWorkshop(view);
    }
}