import * as ko from "knockout";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { RowViewModel } from "../../row/ko/rowViewModel";

export class SlideViewModel {
    public rows: ko.ObservableArray<RowViewModel>;
    public layout: ko.Observable<string>;
    public thumbnail: ko.Observable<BackgroundModel>;
    public background: ko.Observable<BackgroundModel>;
    public css: ko.Observable<string>;

    constructor() {
        this.rows = ko.observableArray<RowViewModel>();
        this.layout = ko.observable<string>("container");
        this.css = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
        this.thumbnail = ko.observable<BackgroundModel>();
    }
}