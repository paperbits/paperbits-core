import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import template from "./mediaSelector.html";
import { MediaItem } from "./mediaItem";
import { IMediaService, MediaContract } from "@paperbits/common/media";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Query, Operator, Page } from "@paperbits/common/persistence";
import { UserError } from "@paperbits/common/errors";

@Component({
    selector: "media-selector",
    template: template
})
export class MediaSelector {
    private currentPage: Page<MediaContract>;
    public readonly searchPattern: ko.Observable<string>;
    public readonly mediaItems: ko.ObservableArray<MediaItem>;
    public readonly working: ko.Observable<boolean>;

    @Param()
    public selectedMedia: ko.Observable<MediaItem>;

    @Param()
    public mimeType: string;

    @Event()
    public onSelect: (media: MediaItem) => void;

    @Event()
    public onHyperlinkSelect: (selection: HyperlinkModel) => void;

    constructor(
        private readonly mediaService: IMediaService,
        private readonly viewManager: ViewManager
    ) {
        this.mediaItems = ko.observableArray<MediaItem>();
        this.selectedMedia = ko.observable<MediaItem>();
        this.searchPattern = ko.observable<string>();
        this.working = ko.observable(false);
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchMedia();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchMedia);
    }

    public async searchMedia(searchPattern: string = ""): Promise<void> {
        this.working(true);
        this.mediaItems([]);

        const query = Query
            .from<MediaContract>()
            .orderBy(`fileName`);

        if (searchPattern) {
            query.where(`fileName`, Operator.contains, searchPattern);
        }

        if (this.mimeType) {
            query.where(`mimeType`, Operator.contains, this.mimeType);
        }

        const mediaOfResults = await this.mediaService.search(query);
        this.currentPage = mediaOfResults;

        const mediaItems = mediaOfResults.value.map(media => new MediaItem(media));
        this.mediaItems.push(...mediaItems);

        this.working(false);
    }

    public async loadNextPage(): Promise<void> {
        if (!this.currentPage?.takeNext || this.working()) {
            return;
        }

        this.working(true);

        this.currentPage = await this.currentPage.takeNext();

        const mediaItems = this.currentPage.value.map(page => new MediaItem(page));
        this.mediaItems.push(...mediaItems);

        this.working(false);
    }

    public selectMedia(media: MediaItem): void {
        this.selectedMedia(media);

        if (this.onSelect) {
            this.onSelect(media);
        }

        if (this.onHyperlinkSelect) {
            this.onHyperlinkSelect(media.getHyperlink());
        }
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

        try {
            for (const file of files) {
                const content = await Utils.readFileAsByteArray(file);
                const uploadPromise = this.mediaService.createMedia(file.name, content, file.type);

                this.viewManager.notifyProgress(uploadPromise, "Media library", `Uploading ${file.name}...`);
                uploadPromises.push(uploadPromise);
            }

            let results: MediaContract[] = [];


            results = await Promise.all<MediaContract>(uploadPromises);
            await this.searchMedia();

            const mediaItem = new MediaItem(results[0]);
            this.selectMedia(mediaItem);
        }
        catch (error) {
            if (error instanceof UserError) {
                this.viewManager.notifyError("Media library", error.message);
            }
            else {
                throw error;
            }
        }
        finally {
            this.working(false);
        }
    }

    public isSelected(media: MediaItem): boolean {
        const selectedMedia = this.selectedMedia();
        return selectedMedia?.key === media.key;
    }
}