import * as ko from "knockout";
import template from "./page.html";
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "paperbits-page",
    template: template
})
export class PageViewModel {
    public title: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public sections: KnockoutObservableArray<Object>;

    constructor() {
        this.title = ko.observable<string>();
        this.description = ko.observable<string>();
        this.keywords = ko.observable<string>();
        this.sections = ko.observableArray<Object>();
    }
}
