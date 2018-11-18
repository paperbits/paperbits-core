import * as ko from "knockout";
import template from "./textblockEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { IEventManager } from "@paperbits/common/events";
import { TextblockViewModel } from "./textblockViewModel";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "html-editor",
    template: template,
    injectable: "textblockEditor"
})
export class TextblockEditor implements IWidgetEditor {
    private readonly eventManager: IEventManager;

    public pluginNames: KnockoutObservableArray<string>;

    constructor(eventManager: IEventManager) {
        this.eventManager = eventManager;

        // rebinding...
        this.setWidgetModel = this.setWidgetModel.bind(this);

        // setting up...
        this.pluginNames = ko.observableArray<string>();
        this.pluginNames.push("formatting");
        this.pluginNames.push("hyperlink-editor");
    }

    public setWidgetModel(model: TextblockViewModel): void {
        this.eventManager.dispatchEvent("enableHtmlEditor", model.htmlEditor);
    }
}