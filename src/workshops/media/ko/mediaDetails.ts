import * as ko from "knockout";
import * as FileSaver from "file-saver";
import template from "./mediaDetails.html";
import { IMediaService } from "@paperbits/common/media";
import { IViewManager } from "@paperbits/common/ui";
import { MediaItem } from "./mediaItem";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "media-details-workshop",
    template: template,
    injectable: "mediaDetailsWorkshop"
})
export class MediaDetailsWorkshop {
    @Param()
    public readonly mediaItem: MediaItem;

    @Event()
    private readonly onDeleteCallback: () => void;

    constructor(
        private readonly mediaService: IMediaService,
        private readonly viewManager: IViewManager
    ) {
        // rebinding...
        this.onMounted = this.onMounted.bind(this);
        this.deleteMedia = this.deleteMedia.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.openCropper = this.openCropper.bind(this);
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.mediaItem.fileName
            .extend(<any>{ required: true, onlyValid: true })
            .subscribe(this.updateMedia);

        this.mediaItem.description
            .subscribe(this.updateMedia);

        this.mediaItem.keywords
            .subscribe(this.updateMedia);

        this.mediaItem.permalink
            .extend(<any>{ uniquePermalink: this.mediaItem.key, onlyValid: true })
            .subscribe(this.updateMedia);

        const mediaContract = await this.mediaService.getMediaByKey(this.mediaItem.key);

        this.mediaItem.permalink(mediaContract.permalink);
    }

    private async updateMedia(): Promise<void> {
        await this.mediaService.updateMedia(this.mediaItem.toMedia());
    }

    public async deleteMedia(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
        await this.mediaService.deleteMedia(this.mediaItem.toMedia());
        this.viewManager.notifySuccess("Media library", `File "${this.mediaItem.fileName()}" was deleted.`);
        this.viewManager.closeWorkshop("media-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback();
        }
    }

    public async downloadMedia(): Promise<void> {
        FileSaver.saveAs(this.mediaItem.downloadUrl(), this.mediaItem.fileName(), { type: this.mediaItem.contentType() });
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