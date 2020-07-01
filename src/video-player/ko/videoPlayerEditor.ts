import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./videoPlayerEditor.html";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { VideoPlayerModel } from "../videoPlayerModel";
import { StyleService } from "@paperbits/styles/styleService";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { SizeStylePluginConfig } from "@paperbits/styles/contracts";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { StyleHelper } from "@paperbits/styles";
import { EventManager, CommonEvents } from "@paperbits/common/events";
import { ViewManager } from "@paperbits/common/ui";

@Component({
    selector: "video-player-editor",
    template: template
})
export class VideoPlayerEditor {
    public readonly sourceUrl: ko.Observable<string>;
    public readonly controls: ko.Observable<boolean>;
    public readonly autoplay: ko.Observable<boolean>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;
    public readonly mimeType: string;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager,
        private readonly styleService: StyleService,
        private readonly mediaPermalinkResolver: IPermalinkResolver
    ) {
        this.sourceUrl = ko.observable<string>();
        this.controls = ko.observable<boolean>(true);
        this.autoplay = ko.observable<boolean>(false);
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable();
        this.sizeConfig = ko.observable();
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

        const variations = await this.styleService.getComponentVariations("videoPlayer");
        this.appearanceStyles(variations.filter(x => x.category === "appearance"));

        this.updateObservables();

        this.eventManager.addEventListener(CommonEvents.onViewportChange, this.updateObservables);

        this.controls
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.autoplay
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.appearanceStyle
            .extend(ChangeRateLimit)
            .subscribe(this.onAppearanceChange);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        this.controls(this.model.controls);
        this.autoplay(this.model.autoplay);

        const sizeStyles = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "size", viewport);
        this.sizeConfig(sizeStyles);

        this.appearanceStyle(this.model?.styles?.appearance);
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

    public onSizeChange(pluginConfig: SizeStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "size", pluginConfig, viewport);

        this.onChange(this.model);
    }

    public onAppearanceChange(variationKey: string): void {
        Objects.setValue(`styles/appearance`, this.model, variationKey);
        
        this.onChange(this.model);
    }

    public applyChanges(): void {
        this.model.controls = this.controls();
        this.model.autoplay = this.autoplay();

        this.onChange(this.model);
    }
}