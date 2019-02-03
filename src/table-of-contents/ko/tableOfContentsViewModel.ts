import * as ko from "knockout";
import template from "./tableOfContents.html";
import { NavigationItemModel } from "@paperbits/common/navigation";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "table-of-contents",
    template: template
})
export class TableOfContentsViewModel {
    public title: KnockoutObservable<string>;
    public maxHeading: KnockoutObservable<number>;
    public nodes: KnockoutObservableArray<NavigationItemModel>;
    public isEmpty: KnockoutComputed<boolean>;

    constructor() {
        this.title = ko.observable<string>();
        this.maxHeading = ko.observable<number>();
        this.nodes = ko.observableArray<NavigationItemModel>([]);
        this.isEmpty = ko.pureComputed(() => {
            const nodes = this.nodes();
            return !nodes || nodes.length === 0;
        });
    }
}