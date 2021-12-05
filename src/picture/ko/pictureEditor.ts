import * as ko from "knockout";
import template from "./pictureEditor.html";
import * as MediaUtils from "@paperbits/common/media/mediaUtils";
import { MediaContract, MediaService } from "@paperbits/common/media";
import { HyperlinkModel, IPermalinkResolver } from "@paperbits/common/permalinks";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { PictureModel } from "../pictureModel";
import { StyleService } from "@paperbits/styles/styleService";
import { LocalStyles } from "@paperbits/common/styles";
import { SizeStylePluginConfig } from "@paperbits/styles/plugins/size/sizeStylePluginConfig";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { MediaItem } from "../../workshops/media/ko";


@Component({
    selector: "picture-editor",
    template: template
})
export class PictureEditor {
    public readonly caption: ko.Observable<string>;
    public readonly sourceKey: ko.Observable<string>;
    public readonly background: ko.Observable<BackgroundModel>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly hyperlinkTitle: ko.Computed<string>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;
    public readonly mediaFileName: ko.Observable<string>;

    constructor(
        private readonly styleService: StyleService,
        private readonly mediaService: MediaService
    ) {
        this.caption = ko.observable<string>();
        this.sourceKey = ko.observable<string>();
        this.background = ko.observable();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkTitle = ko.computed<string>(() => this.hyperlink() ? this.hyperlink().title : "Add a link...");
        this.sizeConfig = ko.observable();
        this.appearanceStyles = ko.observableArray();
        this.appearanceStyle = ko.observable();
        this.mediaFileName = ko.observable();
    }

    @Param()
    public model: PictureModel;

    @Event()
    public onChange: (model: PictureModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        if (this.model.sourceKey) {
            const media = await this.mediaService.getMediaByKey(this.model.sourceKey);

            if (media) {
                const background = new BackgroundModel();
                background.sourceKey = this.model.sourceKey;
                background.sourceUrl = MediaUtils.getThumbnailUrl(media);
                this.background(background);
                this.sourceKey(this.model.sourceKey);
                this.mediaFileName(media.fileName);
            }
        }

        this.caption(this.model.caption);
        this.hyperlink(this.model.hyperlink);
        this.sizeConfig({ width: this.model.width, height: this.model.height });

        const variations = await this.styleService.getComponentVariations("picture");
        this.appearanceStyles(variations.filter(x => x.category === "appearance"));
        this.appearanceStyle(this.model.styles?.appearance);

        this.caption.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.sizeConfig.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.appearanceStyle.extend(ChangeRateLimit).subscribe(this.applyChanges);
    }

    public onVariationSelected(snippet: LocalStyles): void {
        if (snippet) {
            this.appearanceStyle(snippet);
        }
    }

    public applyChanges(): void {
        this.model.caption = this.caption();
        this.model.hyperlink = this.hyperlink();
        this.model.sourceKey = this.sourceKey();

        const appearanceStyle = this.appearanceStyle();

        if (appearanceStyle) {
            this.model.styles = {
                appearance: this.appearanceStyle()
            };
        }

        this.onChange(this.model);
    }

    public async onMediaSelected(media: MediaItem): Promise<void> {
        if (!media) {
            this.background(null);
            this.sourceKey(null);
        }
        else {
            this.sourceKey(media.key);

            const background = new BackgroundModel(); // TODO: Let's use proper model here
            background.sourceKey = media.key;
            background.sourceUrl = media.thumbnailUrl();
            background.size = "contain";
            background.position = "center center";
            this.background(background);
            this.mediaFileName(media.fileName());

            // await this.updateSizeConfigForSelectedMedia(media); // TODO: Set size to media itself on upload
        }

        this.applyChanges();
    }

    public updateSizeConfigForSelectedMedia(media: MediaContract): Promise<void> {
        if (!media.downloadUrl) {
            return;
        }

        return new Promise<void>(resolve => {
            const selectedMedia = new Image();
            selectedMedia.src = media.downloadUrl;

            selectedMedia.onload = () => {
                let width = selectedMedia.width;
                let height = selectedMedia.height;

                if (!media.mimeType.startsWith("image/svg")) {
                    const pixelRatio = devicePixelRatio || 1;
                    width = selectedMedia.width / pixelRatio;
                    height = selectedMedia.height / pixelRatio;
                }

                this.model.width = width;
                this.model.height = height;
                this.sizeConfig({ width: width, height: height });

                resolve();
            };
        });
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);
        this.applyChanges();
    }

    public onSizeChange(sizeConfig: SizeStylePluginConfig): void {
        this.model.width = <number>sizeConfig.width;
        this.model.height = <number>sizeConfig.height;
        this.applyChanges();
    }
}
