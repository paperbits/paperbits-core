import * as ko from "knockout";
import template from "./videoEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IMediaFilter } from "@paperbits/common/media";
import { Component } from "@paperbits/common/ko/decorators";
import { VideoPlayerModel } from "../videoPlayerModel";

@Component({
    selector: "video-player-editor",
    template: template,
    injectable: "videoPlayerEditor"
})
export class VideoEditor {
    private video: VideoPlayerModel;
    private applyChangesCallback: () => void;

    public sourceUrl: ko.Observable<string>;
    public controls: ko.Observable<boolean>;
    public autoplay: ko.Observable<boolean>;

    public readonly mediaFilter: IMediaFilter;

    constructor() {
        this.onSourceUrlUpdate = this.onSourceUrlUpdate.bind(this);
        this.onControlsUpdate = this.onControlsUpdate.bind(this);
        this.onAutoplayUpdate = this.onAutoplayUpdate.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);

        this.sourceUrl = ko.observable<string>();
        this.sourceUrl.subscribe(this.onSourceUrlUpdate);

        this.controls = ko.observable<boolean>(true);
        this.controls.subscribe(this.onControlsUpdate);

        this.autoplay = ko.observable<boolean>(false);
        this.autoplay.subscribe(this.onAutoplayUpdate);

        this.mediaFilter = {
            propertyNames: ["mimeType"],
            propertyValue: "video/mp4",
            startSearch: true
        };
    }

    private onControlsUpdate(controls: boolean): void {
        this.video.controls = controls;
        this.applyChangesCallback();
    }

    private onAutoplayUpdate(autoplay: boolean): void {
        this.video.autoplay = autoplay;
        this.applyChangesCallback();
    }

    private onSourceUrlUpdate(sourceUrl: string): void {
        this.video.sourceUrl = sourceUrl;
        this.applyChangesCallback();
    }

    public setWidgetModel(video: VideoPlayerModel, applyChangesCallback?: () => void): void {
        this.video = video;
        this.applyChangesCallback = applyChangesCallback;
        this.sourceUrl(video.sourceUrl);
        this.controls(video.controls);
        this.autoplay(video.autoplay);
    }

    public onMediaSelected(media: MediaContract): void {
        if (media) {
            this.video.sourceUrl = media.downloadUrl;
            this.video.sourceKey = media.key;
        } else {
            this.video.sourceUrl = undefined;
            this.video.sourceKey = undefined;
        }
        this.sourceUrl(this.video.sourceUrl);

        this.applyChangesCallback();
    }
}