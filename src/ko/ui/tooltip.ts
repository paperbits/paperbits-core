import template from "./tooltip.html";
import * as ko from "knockout";
import { Component, Param, OnMounted } from "@paperbits/common/ko/decorators";
import { stripHtml } from "@paperbits/common";

@Component({
    selector: "tooltip",
    template: template
})
export class Tooltip {
    public readonly announcementText: ko.Observable<string>;

    constructor() {
        this.observableText = ko.observable();
        this.announcementText = ko.observable();
    }

    @Param()
    public text: any;

    @Param()
    public observableText: any;

    @OnMounted()
    public init(): void {
        if (!this.text) {
            return;
        }

        this.observableText(this.text);

        setTimeout(() => {
            this.announcementText(stripHtml(this.text));
        }, 1000);
    }
}