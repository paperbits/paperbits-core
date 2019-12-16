import * as ko from "knockout";
import template from "./youtube.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "youtube-player",
    template: template
})
export class YoutubePlayerViewModel {
    public readonly sourceUrl: ko.Observable<string>;

    constructor() {
        this.sourceUrl = ko.observable<string>();
    }
}