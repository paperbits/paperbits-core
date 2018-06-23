import * as ko from "knockout";
import template from "./media.html";
import * as Utils from "@paperbits/common/utils";
import { IMediaService } from "@paperbits/common/media";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { IContentDropHandler } from "@paperbits/common/editing";
import { MediaItem } from "./mediaItem";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { Keys } from "@paperbits/common/keyboard";
import { IContentDescriptor } from "@paperbits/common/editing";
import { IEventManager } from "@paperbits/common/events";
import { Component } from "../../../ko/component";

@Component({
    selector: "media",
    template: template,
    injectable: "mediaWorkshop"
})
export class MediaWorkshop {
    private searchTimeout: any;

    public searchPattern: KnockoutObservable<string>;
    public mediaItems: KnockoutObservableArray<MediaItem>;
    public selectedMediaItem: KnockoutObservable<MediaItem>;
    public readonly working: KnockoutObservable<boolean>;

    constructor(
        private readonly eventManager: IEventManager,
        private readonly mediaService: IMediaService,
        private readonly viewManager: IViewManager,
        private readonly dropHandlers: Array<IContentDropHandler>
    ) {
        // rebinding...
        this.searchMedia = this.searchMedia.bind(this);
        this.uploadMedia = this.uploadMedia.bind(this);
        this.onMediaUploaded = this.onMediaUploaded.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.selectMedia = this.selectMedia.bind(this);

        // setting up...
        this.working = ko.observable(true);
        this.mediaItems = ko.observableArray<MediaItem>();
        this.searchPattern = ko.observable<string>("");
        this.selectedMediaItem = ko.observable<MediaItem>();

        this.searchPattern.subscribe(this.searchMedia);
        this.searchMedia();
    }

    private async launchSearch(searchPattern: string = ""): Promise<void> {
        this.working(true);

        const result: Array<MediaItem> = [];

        this.mediaItems(result);

        const mediaFiles = await this.mediaService.search(searchPattern);

        mediaFiles.forEach(async media => {
            //TODO: Move this logic to drag start. MediaItem can get descriptor byitself;

            const mediaItem = new MediaItem(media);

            const descriptor = this.findContentDescriptor(media);

            if (descriptor && descriptor.getWidgetOrder) {
                let order = await descriptor.getWidgetOrder();
                mediaItem.widgetOrder = order;

                //mediaItem.downloadUrl  = order.
            }

            this.mediaItems.push(mediaItem);
        });

        this.working(false);
    }

    private findContentDescriptor(media: MediaContract): IContentDescriptor {
        let result: IContentDescriptor;

        for (let i = 0; i < this.dropHandlers.length; i++) {
            const handler = this.dropHandlers[i];

            if (!handler.getContentDescriptorFromMedia) {
                continue;
            }

            result = handler.getContentDescriptorFromMedia(media);

            if (result) {
                return result;
            }
        }

        return result;
    }

    public async searchMedia(searchPattern: string = ""): Promise<void> {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
            this.launchSearch(searchPattern);
        }, 600);
    }

    private onMediaUploaded(): void {
        this.searchMedia();
    }

    public async uploadMedia(): Promise<void> {
        const files = await this.viewManager.openUploadDialog();

        this.working(true);

        const uploadPromises = [];

        for (var index = 0; index < files.length; index++) {
            const file = files[index];
            const content = await Utils.readFileAsByteArray(file);
            const uploadPromise = this.mediaService.createMedia(file.name, content, file.type);

            this.viewManager.addPromiseProgressIndicator(uploadPromise, "Media library", `Uploading ${file.name}...`);
            uploadPromises.push(uploadPromise);
        }

        await Promise.all(uploadPromises);
        await this.searchMedia();
        this.working(false);
    }

    public selectMedia(mediaItem: MediaItem): void {
        mediaItem.hasFocus(true);

        this.selectedMediaItem(mediaItem);
        this.viewManager.openViewAsWorkshop("Media file", "media-details-workshop", {
            mediaItem: mediaItem,
            onDeleteCallback: () => {
                this.searchMedia();
            }
        });
    }

    public async deleteSelectedMedia(): Promise<void> {
        //TODO: Show confirmation dialog according to mockup
        this.viewManager.closeWorkshop("media-details-workshop");

        await this.mediaService.deleteMedia(this.selectedMediaItem().toMedia());
        await this.searchMedia();
    }

    public onDragStart(item: MediaItem): HTMLElement {
        item.widgetFactoryResult = item.widgetOrder.createWidget();

        const widgetElement = item.widgetFactoryResult.element;
        const widgetModel = item.widgetFactoryResult.widgetModel;
        const widgetBinding = item.widgetFactoryResult.widgetBinding;

        this.viewManager.beginDrag({
            type: "widget",
            sourceModel: widgetModel,
            sourceBinding: widgetBinding
        });

        return widgetElement;
    }

    public onDragEnd(item: MediaItem): void {
        item.widgetFactoryResult.element.remove();
        const dragSession = this.viewManager.getDragSession();
        const acceptorBinding = dragSession.targetBinding;

        acceptorBinding.onDragDrop(dragSession);

        this.eventManager.dispatchEvent("virtualDragEnd");
    }

    public onKeyDown(item: MediaItem, event: KeyboardEvent): void {
        if (event.keyCode === Keys.Delete) {
            this.deleteSelectedMedia();
        }
    }
}