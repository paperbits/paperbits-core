import * as ko from "knockout";
import * as FileSaver from "file-saver";
import template from "./mediaDetails.html";
import { IMediaService } from "@paperbits/common/media";
import { ViewManager } from "@paperbits/common/ui";
import { MediaItem } from "./mediaItem";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "media-details-workshop",
    template: template
})
export class MediaDetailsWorkshop {
    public contentTypes: string[] = [
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/tiff",
        "image/x-icon",
        "image/svg+xml",
        "video/mpeg",
        "video/mp4",
        "video/quicktime",
        "video/x-ms-wmv",
        "video/x-msvideo",
        "video/x-flv",
        "video/webm",
    ];

    @Param()
    public readonly mediaItem: MediaItem;

    @Event()
    private readonly onDeleteCallback: () => void;

    constructor(
        private readonly mediaService: IMediaService,
        private readonly viewManager: ViewManager
    ) { }

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.mediaItem.fileName
            .extend(ChangeRateLimit)
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.updateMedia);

        this.mediaItem.downloadUrl
            .extend(ChangeRateLimit)
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.updateMediaUrl);

        this.mediaItem.mimeType
            .extend(ChangeRateLimit)
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.updateMedia);

        this.mediaItem.description
            .extend(ChangeRateLimit)
            .subscribe(this.updateMedia);

        this.mediaItem.keywords
            .extend(ChangeRateLimit)
            .subscribe(this.updateMedia);

        this.mediaItem.permalink
            .extend(ChangeRateLimit)
            .extend(<any>{ required: true, validPermalink: this.mediaItem.key, onlyValid: true })
            .subscribe(this.updateMedia);
    }

    private async updateMediaUrl(): Promise<void> {
        if (this.mediaItem.isDefaultFileName() && !this.mediaItem.isDefaultUrl()) {
            const newName = this.mediaItem.downloadUrl().split("/").pop();
            this.mediaItem.updateDefault(newName);
        }
        await this.updateMedia();
    }

    private async updateMedia(): Promise<void> {
        await this.mediaService.updateMedia(this.mediaItem.toMedia());
    }

    public async deleteMedia(): Promise<void> {
        await this.mediaService.deleteMedia(this.mediaItem.toMedia());
        this.viewManager.notifySuccess("Media library", `File "${this.mediaItem.fileName()}" was deleted.`);
        this.viewManager.closeWorkshop("media-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }
    }

    public downloadMedia(): void {
        FileSaver.saveAs(this.mediaItem.downloadUrl(), this.mediaItem.fileName(), { type: this.mediaItem.mimeType() });
    }

    public openCropper(): void {
        this.viewManager.openViewAsPopup({
            heading: "Edit picture",
            component: {
                name: "picture-cropper",
                params: { mediaItem: this.mediaItem }
            },
            resize: "vertically horizontally"
        });
    }
}