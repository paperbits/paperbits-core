import * as ko from "knockout";
import template from "./youtubeEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { Component } from "../../ko/component";
import { YoutubePlayerModel } from "../youtubePlayerModel";

@Component({
    selector: "youtube-editor",
    template: template,
    injectable: "youtubeEditor"
})
export class YoutubeEditor implements IWidgetEditor {
    private section: YoutubePlayerModel;
    private applyChangesCallback: () => void;

    constructor(
        private readonly viewManager: IViewManager
    ) {
        this.setWidgetModel = this.setWidgetModel.bind(this);
    }

    public setWidgetModel(section: YoutubePlayerModel, applyChangesCallback?: () => void): void {
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}
