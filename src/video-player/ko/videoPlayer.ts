import * as ko from "knockout";
import template from "./videoPlayer.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";

@Component({
    selector: "video-player",
    template: template
})
export class VideoPlayer {
    public sourceUrl: ko.Observable<string>;
    public controls: ko.Observable<boolean>;
    public autoplay: ko.Observable<boolean>;
    public styles: ko.Observable<StyleModel>;

    constructor() {
        this.sourceUrl = ko.observable<string>();
        this.controls = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
        this.styles = ko.observable<StyleModel>();
    }
}