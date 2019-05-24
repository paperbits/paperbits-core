import * as ko from "knockout";
import template from "./tray.html";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { IToolButton, IViewManager } from "@paperbits/common/ui";


@Component({
    selector: "tray",
    template: template,
    injectable: "tray"
})
export class Tray {
    public buttons: ko.ObservableArray<IToolButton>;

    constructor(private readonly trayCommands: IToolButton[]) {
        this.buttons = ko.observableArray<IToolButton>(trayCommands);
    }

    @OnMounted()
    public initialize(): void {
        this.buttons(this.trayCommands);
    }
}