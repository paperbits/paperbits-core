import * as ko from "knockout";
import template from "./mediaSelector.html";
import * as Utils from "@paperbits/common/utils";
import { MediaItem } from "./mediaItem";
import { IMediaService, MediaContract } from "@paperbits/common/media";
import { ViewManager } from "@paperbits/common/ui";
import { EventManager } from "@paperbits/common/events";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { IWidgetService } from "@paperbits/common/widgets";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Style, StyleRule, StyleSheet } from "@paperbits/common/styles";

@Component({
    selector: "media-selector",
    template: template
})
export class MediaSelector {
    public readonly searchPattern: ko.Observable<string>;
    public readonly mediaItems: ko.ObservableArray<MediaItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly expandable: ko.Observable<Object>;
    public readonly isExpanded: ko.Observable<boolean>;

    private preSelectedModel: HyperlinkModel;

    @Param()
    public selectedMedia: ko.Observable<MediaItem>;

    @Param()
    public mimeType: string;

    @Event()
    public onSelect: (media: MediaContract) => void;

    @Event()
    public onHyperlinkSelect: (selection: HyperlinkModel) => void;

    constructor(
        private readonly eventManager: EventManager,
        private readonly mediaService: IMediaService,
        private readonly viewManager: ViewManager,
        private readonly widgetService: IWidgetService
    ) {
        // setting up...
        this.mediaItems = ko.observableArray<MediaItem>();
        this.selectedMedia = ko.observable<MediaItem>();
        this.searchPattern = ko.observable<string>();
        this.working = ko.observable(true);
        this.expandable = ko.observable();
        this.isExpanded = ko.observable();

    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.isExpanded(false);
        await this.searchMedia();

        this.implementExpend(300, 400);

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchMedia);
    }

    private implementExpend(width: number, height: number): void {
        const style = new Style("expandable");
        style.addRules([new StyleRule("width", width + "px"), new StyleRule("height", height + "px")]);

        const styleSheet = new StyleSheet();
        styleSheet.styles.push(style);
        this.expandable(styleSheet);
    }

    public toggleExpand(): void {
        this.isExpanded(!this.isExpanded());
    }


    public async searchMedia(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const mediaFiles = await this.mediaService.search(searchPattern, this.mimeType);
        const mediaItems = mediaFiles.map(media => new MediaItem(media));
        this.mediaItems(mediaItems);

        if (!this.selectedMedia() && this.preSelectedModel) {
            const currentPermalink = this.preSelectedModel.href;
            const current = mediaItems.find(item => item.permalink() === currentPermalink);

            if (current) {
                this.selectMedia(current);
            }
        }

        this.working(false);
    }

    public selectMedia(media: MediaItem): void {
        const prev = this.selectedMedia();
        if (prev) {
            prev.isSelected(false);
        }

        this.selectedMedia(media);
        media.isSelected(true);

        if (this.onSelect) {
            this.onSelect(media.toMedia());
        }

        if (this.onHyperlinkSelect) {
            this.onHyperlinkSelect(media.getHyperlink());
        }
    }

    public selectResource(resource: HyperlinkModel): void {
        this.preSelectedModel = resource;
    }

    public selectNone(): void {
        this.selectedMedia(undefined);
        if (this.onSelect) {
            this.onSelect(null);
        }
    }

    public onMediaUploaded(): void {
        this.searchMedia();
    }

    public async uploadMedia(): Promise<void> {
        const files = await this.viewManager.openUploadDialog();

        this.working(true);

        const uploadPromises = [];

        for (const file of files) {
            const content = await Utils.readFileAsByteArray(file);
            const uploadPromise = this.mediaService.createMedia(file.name, content, file.type);

            this.viewManager.notifyProgress(uploadPromise, "Media library", `Uploading ${file.name}...`);
            uploadPromises.push(uploadPromise);
        }

        const results = await Promise.all<MediaContract>(uploadPromises);
        await this.searchMedia();

        const mediaItem = new MediaItem(results[0]);
        this.selectMedia(mediaItem);

        this.working(false);
    }

    public onDragStart(item: MediaItem): HTMLElement {
        item.widgetFactoryResult = item.widgetOrder.createWidget();

        const widgetElement = item.widgetFactoryResult.element;
        const widgetModel = item.widgetFactoryResult.widgetModel;
        const widgetBinding = item.widgetFactoryResult.widgetBinding;

        this.viewManager.beginDrag({
            sourceModel: widgetModel,
            sourceBinding: widgetBinding
        });

        return widgetElement;
    }

    public onDragEnd(item: MediaItem): void {
        item.widgetFactoryResult.element.remove();
        const dragSession = this.viewManager.getDragSession();
        const acceptorBinding = dragSession.targetBinding;

        if (acceptorBinding && acceptorBinding.handler) {
            const widgetHandler = this.widgetService.getWidgetHandler(acceptorBinding.handler);
            widgetHandler.onDragDrop(dragSession);
        }

        this.eventManager.dispatchEvent("virtualDragEnd");
    }
}