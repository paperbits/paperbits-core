import * as ko from "knockout";
import template from "./youtubePlayer.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";

@Component({
    selector: "youtube-player",
    template: template
})
export class YoutubePlayerViewModel {
    public readonly sourceUrl: ko.Observable<string>;
    public readonly styles: ko.Observable<StyleModel>;

    constructor() {
        this.sourceUrl = ko.observable();
        this.styles = ko.observable();
    }
}