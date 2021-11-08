import * as ko from "knockout";
import template from "./placeholder.html";
import { Component } from "@paperbits/common/ko/decorators";
import { ComponentFlow } from "@paperbits/common/editing";

@Component({
    selector: "paperbits-placeholder",
    template: template
})
export class PlaceholderViewModel {
    public title: ko.Observable<string>;
    public widgetBinding: any;

    constructor(title: string) {
        this.title = ko.observable<string>(title);
        this.widgetBinding = { displayName: title, flow: ComponentFlow.Placeholder, readonly: true };
    }
}
