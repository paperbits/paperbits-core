import * as ko from "knockout";
import template from "./video.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "paperbits-video-player",
    template: template
})
export class VideoPlayerViewModel {
    public sourceUrl: ko.Observable<string>;
    public controls: ko.Observable<boolean>;
    public autoplay: ko.Observable<boolean>;
    public styles: ko.Observable<Object>;

    constructor() {
        this.sourceUrl = ko.observable<string>();
        this.controls = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
        this.styles = ko.observable<Object>();
    }
}