import * as ko from "knockout";
import template from "./pictureEditor.html";
import { MediaContract } from "@paperbits/common/media";
import { HyperlinkModel, IPermalinkResolver } from "@paperbits/common/permalinks";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { PictureModel } from "../pictureModel";
import { StyleService } from "@paperbits/styles/styleService";


@Component({
    selector: "paperbits-picture-editor",
    template: template,
    injectable: "pictureEditor"
})
export class PictureEditor {
    public readonly caption: ko.Observable<string>;
    public readonly layout: ko.Observable<string>;
    public readonly animation: ko.Observable<string>;
    public readonly sourceKey: ko.Observable<string>;
    public readonly background: ko.Observable<BackgroundModel>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly hyperlinkTitle: ko.Computed<string>;
    public readonly width: ko.Observable<number>;
    public readonly height: ko.Observable<number>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;

    constructor(
        private readonly styleService: StyleService,
        private readonly mediaPermalinkResolver: IPermalinkResolver,
    ) {
        this.caption = ko.observable<string>();
        this.layout = ko.observable<string>();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.animation = ko.observable<string>();
        this.sourceKey = ko.observable<string>();
        this.width = ko.observable<number>();
        this.height = ko.observable<number>();
        this.background = ko.observable();
        this.hyperlinkTitle = ko.computed<string>(() => this.hyperlink() ? this.hyperlink().title : "Add a link...");
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();
    }

    @Param()
    public model: PictureModel;

    @Event()
    public onChange: (model: PictureModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        if (this.model.sourceKey) {
            const background = new BackgroundModel();
            background.sourceKey = this.model.sourceKey;
            background.sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(this.model.sourceKey);
            this.background(background);

            this.sourceKey(this.model.sourceKey);
        }

        this.caption(this.model.caption);
        this.hyperlink(this.model.hyperlink);
        this.width(this.model.width);
        this.height(this.model.height);

        const variations = await this.styleService.getComponentVariations("picture");

        this.appearanceStyles(variations.filter(x => x.category === "appearance"));

        if (this.model.styles) {
            this.appearanceStyle(this.model.styles.appearance);
        }

        this.caption.subscribe(this.applyChanges);
        this.layout.subscribe(this.applyChanges);
        this.hyperlink.subscribe(this.applyChanges);
        this.animation.subscribe(this.applyChanges);
        this.width.subscribe(this.applyChanges);
        this.height.subscribe(this.applyChanges);
        this.appearanceStyle.subscribe(this.applyChanges);
    }

    public applyChanges(): void {
        this.model.caption = this.caption();
        this.model.hyperlink = this.hyperlink();
        this.model.sourceKey = this.sourceKey();
        this.model.width = this.width();
        this.model.height = this.height();
        this.model.styles = {
            appearance: this.appearanceStyle()
        };

        this.onChange(this.model);
    }

    public onMediaSelected(media: MediaContract): void {
        if (!media) {
            this.background(null);
            this.sourceKey(null);
        }
        else {
            this.sourceKey(media.key);

            const background = new BackgroundModel(); // TODO: Let's use proper model here
            background.sourceKey = media.key;
            background.sourceUrl = media.downloadUrl;
            background.size = "contain";
            background.position = "center center";
            this.background(background);
        }

        this.applyChanges();
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);
        this.applyChanges();
    }
}
