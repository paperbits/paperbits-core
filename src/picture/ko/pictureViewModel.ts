import * as ko from "knockout";
import template from "./picture.html";
import { Component } from "@paperbits/common/ko/decorators";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { StyleModel } from "@paperbits/common/styles";


@Component({
    selector: "paperbits-picture",
    template: template,
})
export class PictureViewModel {
    public sourceUrl: ko.Observable<string>;
    public caption: ko.Observable<string>;
    public hyperlink: ko.Observable<HyperlinkModel>;
    public width: ko.Observable<number>;
    public height: ko.Observable<number>;
    public styles: ko.Observable<StyleModel>;

    constructor() {
        this.sourceUrl = ko.observable<string>();
        this.caption = ko.observable<string>();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.width = ko.observable<number>();
        this.height = ko.observable<number>();
        this.styles = ko.observable<StyleModel>();
    }
}
