import * as ko from "knockout";
import template from "./section.html";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { Component } from "@paperbits/knockout/decorators";
import { RowViewModel } from "../../row/ko/rowViewModel";

@Component({
    selector: "layout-section",
    template: template
})
export class SectionViewModel {
    public rows: KnockoutObservableArray<RowViewModel>;
    public container: KnockoutObservable<string>;
    public snapTo: KnockoutObservable<string>;
    public background: KnockoutObservable<BackgroundModel>;

    constructor() {
        this.rows = ko.observableArray<RowViewModel>();
        this.container = ko.observable<string>();
        this.snapTo = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
    }
}