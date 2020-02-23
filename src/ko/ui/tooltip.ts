import template from "./tooltip.html";
import * as ko from "knockout";
import { Component, Param, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "tooltip",
    template: template
})
export class Tooltip {
    constructor() {
        this.observableText = ko.observable();
    }

    @Param()
    public text: any;

    @Param()
    public observableText: any;

    @OnMounted()
    public init(): void {
        if (this.text) {
            this.observableText(this.text);
        }
    }
}