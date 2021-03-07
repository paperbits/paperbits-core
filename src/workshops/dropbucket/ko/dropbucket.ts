import template from "./dropbucket.html";
import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { ViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { EventManager, GlobalEventHandler } from "@paperbits/common/events";
import { IMediaService, MediaContract } from "@paperbits/common/media";
import { IContentDropHandler, IContentDescriptor, IDataTransfer } from "@paperbits/common/editing";
import { DropBucketItem } from "./dropbucketItem";
import { Component } from "@paperbits/common/ko/decorators";
import { IWidgetService } from "@paperbits/common/widgets";


@Component({
    selector: "dropbucket",
    template: template
})
export class DropBucket {
    public droppedItems: ko.ObservableArray<DropBucketItem>;

    constructor(
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly eventManager: EventManager,
        private readonly mediaService: IMediaService,
        private readonly dropHandlers: IContentDropHandler[],
        private readonly viewManager: ViewManager,
        private readonly widgetService: IWidgetService
    ) {
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.addPendingContent = this.addPendingContent.bind(this);
        this.uploadContentAsMedia = this.uploadContentAsMedia.bind(this);
        this.discardDroppedContent = this.discardDroppedContent.bind(this);
        this.handleDroppedContent = this.handleDroppedContent.bind(this);
        this.handleUnknownContent = this.handleUnknownContent.bind(this);

        this.globalEventHandler.addDragDropListener(this.onDragDrop);
        // globalEventHandler.addPasteListener(this.onPaste);

        this.dropHandlers = dropHandlers;
        this.droppedItems = ko.observableArray<DropBucketItem>();
    }

    private canHandleDrop(event: DragEvent): boolean {
        return (event.dataTransfer.files && event.dataTransfer.files.length > 0) || event.dataTransfer.getData("url").length > 0;
    }

    private addPendingContent(item: DropBucketItem): void {
        this.droppedItems.push(item);
    }

    private async handleDroppedContent(contentDescriptor: IContentDescriptor): Promise<void> {
        const dropbucketItem = new DropBucketItem();

        dropbucketItem.title = contentDescriptor.title;
        dropbucketItem.description = contentDescriptor.description;

        if (contentDescriptor.getWidgetOrder) {
            const widgetOrder = await contentDescriptor.getWidgetOrder();
            dropbucketItem.widgetOrder(widgetOrder);
        }

        dropbucketItem.thumbnailUrl(contentDescriptor.iconUrl);

        if (contentDescriptor.getThumbnailUrl) {
            contentDescriptor.getThumbnailUrl().then(thumbnailUrl => {
                dropbucketItem.previewUrl(thumbnailUrl);
                dropbucketItem.thumbnailUrl(thumbnailUrl);
            });
        }

        if (contentDescriptor.uploadables && contentDescriptor.uploadables.length) {
            for (const uploadable of contentDescriptor.uploadables) {
                dropbucketItem.uploadables.push(uploadable);
            }
        }

        this.addPendingContent(dropbucketItem);
    }

    private onDragDrop(event: DragEvent): void {

        if (this.viewManager.mode === ViewManagerMode.preview) {
            return;
        }
        if (!this.canHandleDrop(event)) {
            return;
        }

        this.droppedItems.removeAll();

        const dataTransfer = event.dataTransfer;
        const files = Array.prototype.slice.call(dataTransfer.files);

        let items: IDataTransfer[];

        if (dataTransfer.files.length > 0) {
            items = [];

            for (const file of files) {
                items.push({
                    source: file,
                    name: file.name,
                    mimeType: file.type
                });
            }
        }
        else {
            const urlData = dataTransfer.getData("url");
            const parts = urlData.split("/");

            items = [{
                source: urlData,
                name: parts[parts.length - 1]
            }];
        }

        for (const item of items) {
            let handled = false;
            let contentDescriptor: IContentDescriptor = null;
            let j = 0;

            while (contentDescriptor === null && j < this.dropHandlers.length) {
                contentDescriptor = this.dropHandlers[j].getContentDescriptorFromDataTransfer(item);

                if (contentDescriptor) {
                    this.handleDroppedContent(contentDescriptor);
                    handled = true;
                }
                j++;
            }

            if (!handled) { // none found
                this.handleUnknownContent(dataTransfer);
            }
        }
    }

    private onPaste(event: ClipboardEvent): void {
        this.droppedItems.removeAll();
        const text = event.clipboardData.getData("text");
        let i = 0;
        let contentDescriptor: IContentDescriptor = null;

        while (contentDescriptor === null && i < this.dropHandlers.length) {
            contentDescriptor = this.dropHandlers[i].getContentDescriptorFromDataTransfer({
                source: text,
                name: text.split("/").pop().split("?")[0]
            });

            if (contentDescriptor) {
                this.handleDroppedContent(contentDescriptor);
            }

            i++;
        }
    }

    private handleUnknownContent(dataTransfer: DataTransfer): void {
        if (dataTransfer.files.length === 0) {
            return;
        }

        let title = "File";
        let description = dataTransfer.files[0].name;

        if (dataTransfer.files.length > 1) {
            title = `${dataTransfer.files.length} files`;
            description = "";
        }

        const files = Array.prototype.slice.call(dataTransfer.files);
        const dropbucketItem = new DropBucketItem();
        const uploadables = [];

        for (const file of files) {
            uploadables.push(file);
        }

        dropbucketItem.title = title;
        dropbucketItem.description = description;
        dropbucketItem.uploadables(uploadables);

        this.addPendingContent(dropbucketItem);
    }

    public onDragStart(item: DropBucketItem): HTMLElement {
        if (this.viewManager.mode === ViewManagerMode.preview) {
            return;
        }
        item.widgetFactoryResult = item.widgetOrder().createWidget();

        const widgetElement = item.widgetFactoryResult.element;
        const widgetModel = item.widgetFactoryResult.widgetModel;
        const widgetBinding = item.widgetFactoryResult.widgetBinding;

        this.droppedItems.remove(item);

        this.viewManager.beginDrag({
            sourceModel: widgetModel,
            sourceBinding: widgetBinding
        });

        return widgetElement;
    }

    public async onDragEnd(dropbucketItem: DropBucketItem): Promise<void> {
        if (this.viewManager.mode === ViewManagerMode.preview) {
            return;
        }
        dropbucketItem.widgetFactoryResult.element.remove();
        this.droppedItems.remove(dropbucketItem);

        const uploadables = dropbucketItem.uploadables();

        if (uploadables && uploadables.length > 0) {
            this.uploadContentAsMedia(dropbucketItem);
            this.droppedItems.remove(dropbucketItem);
        }

        const dragSession = this.viewManager.getDragSession();
        const acceptorBinding = dragSession.targetBinding;

        if (acceptorBinding && acceptorBinding.handler) {
            const widgetHandler = this.widgetService.getWidgetHandler(acceptorBinding.handler);
            widgetHandler.onDragDrop(dragSession);
        }

        this.eventManager.dispatchEvent("virtualDragEnd");
    }

    public async uploadContentAsMedia(dropbucketItem: DropBucketItem): Promise<void> {
        const uploadables = dropbucketItem.uploadables();

        this.droppedItems.remove(dropbucketItem);

        uploadables.forEach(async uploadable => {
            let uploadPromise: Promise<MediaContract>;

            if (typeof uploadable === "string") {
                const name = uploadable.split("/").pop().split("?")[0];
                uploadPromise = Utils.downloadFile(uploadable).then(blob => this.mediaService.createMedia(name, blob));
                this.viewManager.notifyProgress(uploadPromise, "Media library", `Uploading ${uploadable}...`);
            }
            else {
                // TODO: Restore
                const content = await Utils.readFileAsByteArray(uploadable);
                uploadPromise = this.mediaService.createMedia(uploadable.name, content, uploadable.type);
                this.viewManager.notifyProgress(uploadPromise, "Media library", `Uploading ${uploadable.name}...`);
            }
        });
    }

    public discardDroppedContent(): void {
        this.droppedItems.removeAll();
    }
}