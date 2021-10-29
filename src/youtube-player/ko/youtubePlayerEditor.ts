import * as ko from "knockout";
import template from "./youtubePlayerEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { StyleHelper } from "@paperbits/styles";
import { YoutubePlayerModel } from "../youtubePlayerModel";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { WidgetEditor } from "@paperbits/common/widgets";
import { SizeStylePluginConfig } from "@paperbits/styles/plugins";
import { ViewManager } from "@paperbits/common/ui";
import { EventManager, Events } from "@paperbits/common/events";

@Component({
    selector: "youtube-player-editor",
    template: template
})
export class YoutubePlayerEditor implements WidgetEditor<YoutubePlayerModel> {
    public readonly videoId: ko.Observable<string>;
    public readonly controls: ko.Observable<boolean>;
    public readonly autoplay: ko.Observable<boolean>;
    public readonly loop: ko.Observable<boolean>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
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
        this.updateObservables();

        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);

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

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();
        
        const sizeStyles = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "size", viewport);
        this.sizeConfig(sizeStyles);

        this.videoId(this.model.videoId);
        this.controls(this.model.controls);
        this.autoplay(this.model.autoplay);
        this.loop(this.model.loop);
    }

    public onSizeChange(pluginConfig: SizeStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "size", pluginConfig, viewport);

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
