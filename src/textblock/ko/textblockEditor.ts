import * as ko from "knockout";
import template from "./textblockEditor.html";
import { EventManager } from "@paperbits/common/events";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TextblockModel } from "..";

@Component({
    selector: "text-block-editor",
    template: template
})
export class TextblockEditor {
    public pluginNames: ko.ObservableArray<string>;

    constructor(
        private readonly eventManager: EventManager,
        private readonly textblockEditorPlugins: string[]
    ) {
        this.pluginNames = ko.observableArray<string>();
    }

    @Param()
    public model: TextblockModel;

    @Event()
    public onChange: (model: TextblockModel) => void;

    @OnMounted()
    public initialize(): void {
        this.pluginNames.push(...this.textblockEditorPlugins);
        this.eventManager.dispatchEvent("enableHtmlEditor");
    }
}