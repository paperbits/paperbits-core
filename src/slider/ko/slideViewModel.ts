import * as ko from "knockout";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { RowViewModel } from "../../row/ko/rowViewModel";

export class SlideViewModel {
    public rows: KnockoutObservableArray<RowViewModel>;
    public layout: KnockoutObservable<string>;
    public thumbnail: KnockoutObservable<BackgroundModel>;
    public background: KnockoutObservable<BackgroundModel>;
    public css: KnockoutObservable<string>;

    constructor() {
        this.rows = ko.observableArray<RowViewModel>();
        this.layout = ko.observable<string>("container");
        this.css = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
        this.thumbnail = ko.observable<BackgroundModel>();
    }
}