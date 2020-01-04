import * as ko from "knockout";
import template from "./placeholder.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "paperbits-placeholder",
    template: template
})
export class PlaceholderViewModel {
    public title: ko.Observable<string>;

    constructor(title: string) {
        this.title = ko.observable<string>(title);
    }
}
