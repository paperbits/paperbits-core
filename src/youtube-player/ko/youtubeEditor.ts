import * as ko from "knockout";
import template from "./youtubeEditor.html";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { Component } from "@paperbits/common/ko/decorators";
import { YoutubePlayerModel } from "../youtubePlayerModel";
import { changeRateLimit } from "../../ko/consts";

@Component({
    selector: "youtube-editor",
    template: template,
    injectable: "youtubeEditor"
})
export class YoutubeEditor implements IWidgetEditor {
    private model: YoutubePlayerModel;
    private applyChangesCallback: () => void;

    public videoId: KnockoutObservable<string>;
    public origin: KnockoutObservable<string>;
    public controls: KnockoutObservable<boolean>;
    public autoplay: KnockoutObservable<boolean>;
    public loop: KnockoutObservable<boolean>;

    constructor() {
        this.setWidgetModel = this.setWidgetModel.bind(this);
        this.onControlsUpdate = this.onControlsUpdate.bind(this);

        this.videoId = ko.observable<string>().extend(changeRateLimit);
        this.origin = ko.observable<string>().extend(changeRateLimit);
        this.controls = ko.observable<boolean>().extend(changeRateLimit);
        this.autoplay = ko.observable<boolean>().extend(changeRateLimit);
        this.loop = ko.observable<boolean>().extend(changeRateLimit);
        
        this.videoId.subscribe(this.onControlsUpdate);
        this.origin.subscribe(this.onControlsUpdate);
        this.controls.subscribe(this.onControlsUpdate);
        this.autoplay.subscribe(this.onControlsUpdate);
        this.loop.subscribe(this.onControlsUpdate);
    }

    private onControlsUpdate(): void {
        this.model.videoId  = this.videoId();
        this.model.origin  = this.origin();
        this.model.controls = this.controls();
        this.model.autoplay = this.autoplay();
        this.model.loop     = this.loop();
        this.applyChangesCallback();
    }

    public setWidgetModel(model: YoutubePlayerModel, applyChangesCallback?: () => void): void {
        this.model = model;
        this.applyChangesCallback = applyChangesCallback;
        this.videoId(model.videoId);
        this.origin(model.origin);
        this.controls(model.controls);
        this.autoplay(model.autoplay);
        this.loop(model.loop);
    }
}
