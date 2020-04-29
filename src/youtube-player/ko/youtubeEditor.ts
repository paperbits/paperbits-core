import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./youtubeEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { YoutubePlayerModel } from "../youtubePlayerModel";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { WidgetEditor } from "@paperbits/common/widgets";
import { SizeStylePluginConfig } from "@paperbits/styles/contracts";

@Component({
    selector: "youtube-editor",
    template: template
})
export class YoutubeEditor implements WidgetEditor<YoutubePlayerModel> {
    public readonly videoId: ko.Observable<string>;
    public readonly controls: ko.Observable<boolean>;
    public readonly autoplay: ko.Observable<boolean>;
    public readonly loop: ko.Observable<boolean>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;

    constructor() {
        this.videoId = ko.observable<string>();
        this.controls = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
        this.loop = ko.observable<boolean>();
        this.sizeConfig = ko.observable();
    }

    @Param()
    public model: YoutubePlayerModel;

    @Event()
    public onChange: (model: YoutubePlayerModel) => void;

    @OnMounted()
    public initialize(): void {
        this.videoId(this.model.videoId);
        this.controls(this.model.controls);
        this.autoplay(this.model.autoplay);
        this.loop(this.model.loop);

        const sizeConfig: SizeStylePluginConfig = this.model?.styles?.instance?.size;
        this.sizeConfig(sizeConfig);

        this.videoId
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.controls
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.autoplay
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.loop
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);
    }

    public onSizeChange(pluginConfig: SizeStylePluginConfig): void {
        Objects.setValue(`styles/instance/size`, this.model, pluginConfig);
        this.applyChanges();
    }

    private applyChanges(): void {
        this.model.videoId = this.videoId();
        this.model.controls = this.controls();
        this.model.autoplay = this.autoplay();
        this.model.loop = this.loop();

        this.onChange(this.model);
    }
}
