import * as ko from "knockout";
import template from "./picture.html";
import { Component } from "../../ko/decorators/component.decorator";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { HyperlinkModel } from "@paperbits/common/permalinks";


@Component({
    selector: "paperbits-picture",
    template: template,
})
export class PictureViewModel {
    public caption: KnockoutObservable<string>;
    public action: KnockoutObservable<string>;
    public layout: KnockoutObservable<string>;
    public animation: KnockoutObservable<string>;
    public background: KnockoutObservable<BackgroundModel>;
    public hyperlink: KnockoutObservable<HyperlinkModel>;
    public width: KnockoutObservable<number>;
    public height: KnockoutObservable<number>;

    constructor() {
        this.caption = ko.observable<string>();
        this.layout = ko.observable<string>();
        this.animation = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.width = ko.observable<number>();
        this.height = ko.observable<number>();
    }
}
