import * as ko from "knockout";
import template from "./picture.html";
import { ILightbox } from "@paperbits/common/ui"; // TODO: Can be plugged in as binding
import { Component } from "@paperbits/knockout/decorators/component";
import { BackgroundModel } from "@paperbits/common/widgets/background";


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
    public css: KnockoutObservable<string>;

    constructor() {
        this.caption = ko.observable<string>();
        this.layout = ko.observable<string>();
        this.animation = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();
        this.css = ko.observable<string>();
    }
}
