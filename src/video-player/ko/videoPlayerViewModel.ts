import * as ko from "knockout";
import template from "./video.html";
import { Component } from "../../ko/component";

@Component({
    selector: "paperbits-video-player",
    template: template
})
export class VideoPlayerViewModel {
    public sourceUrl: KnockoutObservable<string>;
    public controls: KnockoutObservable<boolean>;
    public autoplay: KnockoutObservable<boolean>;

    constructor() {
        this.sourceUrl = ko.observable<string>();
        this.controls = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
    }
}