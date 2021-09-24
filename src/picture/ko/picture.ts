import * as ko from "knockout";
import template from "./picture.html";
import { Component } from "@paperbits/common/ko/decorators";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { StyleModel } from "@paperbits/common/styles";
import { MediaVariantModel } from "../mediaVariantModel";


@Component({
    selector: "paperbits-picture",
    template: template,
})
export class PictureViewModel {
    public readonly sourceUrl: ko.Observable<string>;
    public readonly caption: ko.Observable<string>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly variants: ko.Observable<MediaVariantModel[]>;
    public readonly width: ko.Observable<number>;
    public readonly height: ko.Observable<number>;
    public readonly styles: ko.Observable<StyleModel>;

    constructor() {
        this.sourceUrl = ko.observable<string>();
        this.caption = ko.observable<string>();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.variants = ko.observable<MediaVariantModel[]>();
        this.width = ko.observable<number>();
        this.height = ko.observable<number>();
        this.styles = ko.observable<StyleModel>();
    }
}
