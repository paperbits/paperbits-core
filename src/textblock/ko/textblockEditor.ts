import * as ko from "knockout";
import template from "./textblockEditor.html";
import { IEventManager } from "@paperbits/common/events";
import { TextblockViewModel } from "./textblockViewModel";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "html-editor",
    template: template,
    injectable: "textblockEditor"
})
export class TextblockEditor {
    public pluginNames: ko.ObservableArray<string>;

    constructor(private readonly eventManager: IEventManager) {
        this.pluginNames = ko.observableArray<string>();
        this.pluginNames.push("formatting");
        this.pluginNames.push("hyperlink-editor");
    }

    public setWidgetModel(model: TextblockViewModel): void {
        this.eventManager.dispatchEvent("enableHtmlEditor", model.htmlEditor);
    }
}