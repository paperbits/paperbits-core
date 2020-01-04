import * as ko from "knockout";
import template from "./textblockEditor.html";
import { EventManager } from "@paperbits/common/events";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TextblockModel } from "..";

@Component({
    selector: "html-editor",
    template: template
})
export class TextblockEditor {
    public pluginNames: ko.ObservableArray<string>;

    constructor(private readonly eventManager: EventManager) {
        this.pluginNames = ko.observableArray<string>();
        this.pluginNames.push("formatting");
        this.pluginNames.push("hyperlink-editor");
    }

    @Param()
    public model: TextblockModel;

    @Event()
    public onChange: (model: TextblockModel) => void;

    @OnMounted()
    public initialize(): void {
        this.eventManager.dispatchEvent("enableHtmlEditor", this.model.htmlEditor);
    }
}