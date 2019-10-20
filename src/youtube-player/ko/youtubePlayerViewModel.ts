import * as ko from "knockout";
import template from "./youtube.html";
import { Component } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "paperbits-youtube-player",
    template: template
})
export class YoutubePlayerViewModel {
    public videoSource: ko.Observable<string>;
    public videoId: ko.Observable<string>;
    public origin: ko.Observable<string>;
    public controls: ko.Observable<boolean>;
    public autoplay: ko.Observable<boolean>;
    public loop: ko.Observable<boolean>;

    constructor() {
        this.videoSource = ko.observable<string>();

        this.videoId = ko.observable<string>().extend(ChangeRateLimit);
        this.origin = ko.observable<string>().extend(ChangeRateLimit);
        this.controls = ko.observable<boolean>().extend(ChangeRateLimit);
        this.autoplay = ko.observable<boolean>().extend(ChangeRateLimit);
        this.loop = ko.observable<boolean>().extend(ChangeRateLimit);

        this.onControlsUpdate = this.onControlsUpdate.bind(this);

        this.videoId.subscribe(this.onControlsUpdate);
        this.origin.subscribe(this.onControlsUpdate);
        this.controls.subscribe(this.onControlsUpdate);
        this.autoplay.subscribe(this.onControlsUpdate);
        this.loop.subscribe(this.onControlsUpdate);
    }

    private onControlsUpdate(): void {
        const videoId  = this.videoId();
        const origin  = this.origin();
        const controls = this.controls();
        const autoplay = this.autoplay();
        const loop     = this.loop();

        let videoSource = videoId;
        videoSource = this.addQueryParameter(videoSource, "controls", controls ? "1" : "0");
        videoSource = autoplay ? this.addQueryParameter(videoSource, "autoplay", "1") : videoSource;
        videoSource = !!origin ? this.addQueryParameter(videoSource, "origin", origin) : videoSource;
        if (loop) {
            videoSource = this.addQueryParameter(videoSource, "playlist", videoId);
            videoSource = this.addQueryParameter(videoSource, "loop", "1");
        }

        this.videoSource(videoSource);
        console.log("Youtube:" + videoSource);

    }

    private addQueryParameter(uri: string, name: string, value?: string): string {
        uri += `${uri.indexOf("?") >= 0 ? "&" : "?"}${name}`;
        if (value) {
            uri += `=${value}`;
        }
        return uri;
    }
}