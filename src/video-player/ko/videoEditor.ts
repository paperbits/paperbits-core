import * as ko from "knockout";
import template from "./videoEditor.html";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { VideoPlayerModel } from "../videoPlayerModel";
import { StyleService } from "@paperbits/styles/styleService";
import { IPermalinkResolver } from "@paperbits/common/permalinks";

@Component({
    selector: "video-player-editor",
    template: template
})
export class VideoEditor {
    public readonly sourceUrl: ko.Observable<string>;
    public readonly controls: ko.Observable<boolean>;
    public readonly autoplay: ko.Observable<boolean>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;
    public readonly mimeType: string;

    constructor(
        private readonly styleService: StyleService,
        private readonly mediaPermalinkResolver: IPermalinkResolver
    ) {
        this.sourceUrl = ko.observable<string>();
        this.controls = ko.observable<boolean>(true);
        this.autoplay = ko.observable<boolean>(false);
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();

        this.mimeType = "video/mp4";
    }

    @Param()
    public model: VideoPlayerModel;

    @Event()
    public onChange: (model: VideoPlayerModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        let sourceUrl;

        if (this.model.sourceKey) {
            sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(this.model.sourceKey);
        }

        this.sourceUrl(sourceUrl);
        this.controls(this.model.controls);
        this.autoplay(this.model.autoplay);

        const variations = await this.styleService.getComponentVariations("videoPlayer");

        this.appearanceStyles(variations.filter(x => x.category === "appearance"));

        if (this.model.styles) {
            this.appearanceStyle(this.model.styles.appearance);
        }

        this.controls.subscribe(this.applyChanges);
        this.autoplay.subscribe(this.applyChanges);
        this.appearanceStyle.subscribe(this.applyChanges);
    }

    public applyChanges(): void {
        this.model.controls = this.controls();
        this.model.autoplay = this.autoplay();
        this.model.styles = {
            appearance: this.appearanceStyle()
        };

        this.onChange(this.model);
    }

    public onMediaSelected(media: MediaContract): void {
        if (media) {
            this.model.sourceKey = media.key;
            this.sourceUrl(media.downloadUrl);
        } 
        else {
            this.model.sourceKey = undefined;
            this.sourceUrl(null);
        }

        this.onChange(this.model);
    }
}