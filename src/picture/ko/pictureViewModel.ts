import * as ko from "knockout";
import template from "./picture.html";
import { Component } from "@paperbits/common/ko/decorators";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { HyperlinkModel } from "@paperbits/common/permalinks";


@Component({
    selector: "paperbits-picture",
    template: template,
})
export class PictureViewModel {
    public caption: ko.Observable<string>;
    public action: ko.Observable<string>;
    public layout: ko.Observable<string>;
    public animation: ko.Observable<string>;
    public background: ko.Observable<BackgroundModel>;
    public hyperlink: ko.Observable<HyperlinkModel>;
    public width: ko.Observable<number>;
    public height: ko.Observable<number>;
    public styles: ko.Observable<Object>;

    constructor() {
        this.caption = ko.observable<string>();
        this.layout = ko.observable<string>();
        this.animation = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.width = ko.observable<number>();
        this.height = ko.observable<number>();
        this.styles = ko.observable<Object>();
    }
}
