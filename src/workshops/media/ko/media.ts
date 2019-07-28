import * as ko from "knockout";
import template from "./media.html";
import * as Utils from "@paperbits/common/utils";
import { IMediaService } from "@paperbits/common/media";
import { IViewManager, IView } from "@paperbits/common/ui";
import { IContentDropHandler, IContentDescriptor } from "@paperbits/common/editing";
import { MediaItem } from "./mediaItem";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { Keys } from "@paperbits/common/keyboard";
import { IEventManager } from "@paperbits/common/events";
import { Component } from "@paperbits/common/ko/decorators";
import { IWidgetService } from "@paperbits/common/widgets";

@Component({
    selector: "media",
    template: template,
    injectable: "mediaWorkshop"
})
export class MediaWorkshop {
    private searchTimeout: any;

    public searchPattern: ko.Observable<string>;
    public mediaItems: ko.ObservableArray<MediaItem>;
    public selectedMediaItem: ko.Observable<MediaItem>;
    public readonly working: ko.Observable<boolean>;

    constructor(
        private readonly eventManager: IEventManager,
        private readonly mediaService: IMediaService,
        private readonly viewManager: IViewManager,
        private readonly dropHandlers: IContentDropHandler[],
        private readonly widgetService: IWidgetService
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

        const result: MediaItem[] = [];

        this.mediaItems(result);

        const mediaFiles = await this.mediaService.search(searchPattern);

        mediaFiles.forEach(async media => {
            // TODO: Move this logic to drag start. MediaItem can get descriptor byitself;

            const mediaItem = new MediaItem(media);
            const descriptor = this.findContentDescriptor(media);

            if (descriptor && descriptor.getWidgetOrder) {
                const order = await descriptor.getWidgetOrder();
                mediaItem.widgetOrder = order;

                // mediaItem.downloadUrl  = order.
            }

            this.mediaItems.push(mediaItem);
        });

        this.working(false);
    }

    private findContentDescriptor(media: MediaContract): IContentDescriptor {
        let result: IContentDescriptor;

        for (const handler of this.dropHandlers) {
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

        for (const file of files) {
            const content = await Utils.readFileAsByteArray(file);
            const uploadPromise = this.mediaService.createMedia(file.name, content, file.type);

            this.viewManager.notifyProgress(uploadPromise, "Media library", `Uploading ${file.name}...`);
            uploadPromises.push(uploadPromise);
        }

        await Promise.all(uploadPromises);
        await this.searchMedia();
        this.working(false);
    }

    public selectMedia(mediaItem: MediaItem): void {
        mediaItem.hasFocus(true);
        this.selectedMediaItem(mediaItem);

        const view: IView = {
            heading: "Media file",
            component: {
                name: "media-details-workshop",
                params: {
                    mediaItem: mediaItem,
                    onDeleteCallback: () => {
                        this.searchMedia();
                    }
                }
            }
        };

        this.viewManager.openViewAsWorkshop(view);
    }

    public async deleteSelectedMedia(): Promise<void> {
        // TODO: Show confirmation dialog according to mockup
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

        if (acceptorBinding && acceptorBinding.handler) {
            const widgetHandler = this.widgetService.getWidgetHandler(acceptorBinding.handler);
            widgetHandler.onDragDrop(dragSession);
        }

        this.eventManager.dispatchEvent("virtualDragEnd");
    }

    public onKeyDown(item: MediaItem, event: KeyboardEvent): void {
        if (event.keyCode === Keys.Delete) {
            this.deleteSelectedMedia();
        }
    }
}