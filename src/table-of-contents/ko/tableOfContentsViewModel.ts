import * as ko from "knockout";
import template from "./tableOfContents.html";
import { NavigationItemModel } from "@paperbits/common/navigation/navigationItemModel";
import { Component } from "../../ko/component";

@Component({
    selector: "table-of-contents",
    template: template
})
export class TableOfContentsViewModel {
    public title: KnockoutObservable<string>;
    public navigationItemKey: KnockoutObservable<string>;
    public nodes: KnockoutObservableArray<NavigationItemModel>;
    public isEmpty: KnockoutComputed<boolean>;

    constructor() {
        this.title = ko.observable<string>();
        this.navigationItemKey = ko.observable<string>();
        this.nodes = ko.observableArray<NavigationItemModel>();
        this.isEmpty = ko.pureComputed(() => this.nodes().length === 0);
    }
}