import * as ko from "knockout";
import template from "./youtubeEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { YoutubePlayerModel } from "../youtubePlayerModel";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { WidgetEditor } from "@paperbits/common/widgets";

@Component({
    selector: "youtube-editor",
    template: template,
    injectable: "youtubeEditor"
})
export class YoutubeEditor implements WidgetEditor<YoutubePlayerModel> {
    public readonly videoId: ko.Observable<string>;
    public readonly origin: ko.Observable<string>;
    public readonly controls: ko.Observable<boolean>;
    public readonly autoplay: ko.Observable<boolean>;
    public readonly loop: ko.Observable<boolean>;

    constructor() {
        this.videoId = ko.observable<string>();
        this.origin = ko.observable<string>();
        this.controls = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
        this.loop = ko.observable<boolean>();
    }

    @Param()
    public model: YoutubePlayerModel;

    @Event()
    public onChange: (model: YoutubePlayerModel) => void;

    @OnMounted()
    public initialize(): void {
        this.videoId(this.model.videoId);
        this.origin(this.model.origin);
        this.controls(this.model.controls);
        this.autoplay(this.model.autoplay);
        this.loop(this.model.loop);

        this.videoId
            .extend(ChangeRateLimit)
            .subscribe(this.onControlsUpdate);

        this.origin
            .extend(ChangeRateLimit)
            .subscribe(this.onControlsUpdate);

        this.controls
            .extend(ChangeRateLimit)
            .subscribe(this.onControlsUpdate);

        this.autoplay
            .extend(ChangeRateLimit)
            .subscribe(this.onControlsUpdate);

        this.loop
            .extend(ChangeRateLimit)
            .subscribe(this.onControlsUpdate);
    }

    private onControlsUpdate(): void {
        this.model.videoId = this.videoId();
        this.model.origin = this.origin();
        this.model.controls = this.controls();
        this.model.autoplay = this.autoplay();
        this.model.loop = this.loop();

        this.onChange(this.model);
    }
}
