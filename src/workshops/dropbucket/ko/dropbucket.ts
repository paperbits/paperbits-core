import * as ko from "knockout";
import template from "./dropbucket.html";
import * as Utils from "@paperbits/common/utils";
import { IViewManager } from "@paperbits/common/ui";
import { IEventManager, GlobalEventHandler } from "@paperbits/common/events";
import { IMediaService, ICreatedMedia  } from "@paperbits/common/media";
import { IContentDropHandler, IContentDescriptor, IDataTransfer } from "@paperbits/common/editing";
import { ProgressPromise } from "@paperbits/common";
import { DropBucketItem } from "./dropbucketItem";
import { Component } from "../../../ko/component";

/*
   - Drop bucket introduces a special container for dropping content,
     which, if supported, could be picked up by a widget;

   - If dropped content is supported by several widgets (i.e. Bing and Google maps), user will be able to choose;
   
   - All KNOWN content is dragged only from Vienna UI with attached context;
   
   - Widget/Content handler registrations should be injected in respective order;
*/

@Component({
    selector: "dropbucket",
    template: template,
    injectable: "dropbucket"
})
export class DropBucket {
    private readonly eventManager: IEventManager;
    private readonly dropHandlers: Array<IContentDropHandler>;
    private readonly mediaService: IMediaService;
    private readonly viewManager: IViewManager;

    public droppedItems: KnockoutObservableArray<DropBucketItem>;

    constructor(globalEventHandler: GlobalEventHandler, eventManager: IEventManager, mediaService: IMediaService, dropHandlers: Array<IContentDropHandler>, viewManager: IViewManager) {
        this.eventManager = eventManager;
        this.mediaService = mediaService;
        this.viewManager = viewManager;

        this.onDragDrop = this.onDragDrop.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.addPendingContent = this.addPendingContent.bind(this);
        this.uploadContentAsMedia = this.uploadContentAsMedia.bind(this);
        this.discardDroppedContent = this.discardDroppedContent.bind(this);
        this.handleDroppedContent = this.handleDroppedContent.bind(this);
        this.handleUnknownContent = this.handleUnknownContent.bind(this);

        globalEventHandler.addDragDropListener(this.onDragDrop);
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
            for (let i = 0; i < contentDescriptor.uploadables.length; i++) {
                const uploadable = contentDescriptor.uploadables[i];
                dropbucketItem.uploadables.push(uploadable);
            }
        }

        this.addPendingContent(dropbucketItem);
    }

    private onDragDrop(event: DragEvent): void {
        if (!this.canHandleDrop(event)) {
            return;
        }

        this.droppedItems.removeAll();

        let dataTransfer = event.dataTransfer;
        let items: IDataTransfer[];

        if (dataTransfer.files.length > 0) {
            items = [];
            for (let i = 0; i < dataTransfer.files.length; i++) {
                items.push({
                    source: dataTransfer.files[i],
                    name: dataTransfer.files[i].name,
                    mimeType: dataTransfer.files[i].type
                });
            }
        }
        else {
            let urlData = dataTransfer.getData("url");
            let parts = urlData.split("/");

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
        let title: string;
        let description: string = "";

        if (dataTransfer.files.length > 1) {
            title = `${dataTransfer.files.length} files`;
        }
        else if (dataTransfer.files.length > 0) {
            title = "File";
            description = dataTransfer.files[0].name;
        }
        else {
            title = "Piece of text";
        }

        const dropbucketItem = new DropBucketItem();
        const uploadables = [];

        for (let i = 0; i < dataTransfer.files.length; i++) {
            uploadables.push(dataTransfer.files[i]);
        }

        dropbucketItem.title = title;
        dropbucketItem.description = description;
        dropbucketItem.uploadables(uploadables);

        this.addPendingContent(dropbucketItem);
    }

    public onDragStart(item: DropBucketItem): HTMLElement {
        item.widgetFactoryResult = item.widgetOrder().createWidget();

        const widgetElement = item.widgetFactoryResult.element;
        const widgetModel = item.widgetFactoryResult.widgetModel;
        const widgetBinding = item.widgetFactoryResult.widgetBinding;

        this.droppedItems.remove(item);

        this.viewManager.beginDrag({
            type: "widget",
            sourceModel: widgetModel,
            sourceBinding: widgetBinding
        });

        return widgetElement;
    }

    public async onDragEnd(dropbucketItem: DropBucketItem): Promise<void> {
        dropbucketItem.widgetFactoryResult.element.remove();
        this.droppedItems.remove(dropbucketItem);

        const uploadables = dropbucketItem.uploadables();

        if (uploadables && uploadables.length > 0) {
            this.uploadContentAsMedia(dropbucketItem);
            this.droppedItems.remove(dropbucketItem);
        }

        const dragSession = this.viewManager.getDragSession();
        const acceptorBinding = dragSession.targetBinding;

        acceptorBinding.onDragDrop(dragSession);

        this.eventManager.dispatchEvent("virtualDragEnd");
    }

    public uploadContentAsMedia(dropbucketItem: DropBucketItem): void {
        let uploadables = dropbucketItem.uploadables();

        this.droppedItems.remove(dropbucketItem);

        uploadables.forEach(async uploadable => {
            let uploadPromise: ProgressPromise<ICreatedMedia>;

            if (typeof uploadable === "string") {
                const name = uploadable.split("/").pop().split("?")[0];

                uploadPromise = Utils
                    .downloadFile(uploadable)
                    .sequence(blob => this.mediaService.createMedia(name, blob));

                this.viewManager.addPromiseProgressIndicator(uploadPromise, "Media library", `Uploading ${uploadable}...`);
            }
            else {
                // TODO: Restore
                const content = await Utils.readFileAsByteArray(uploadable);
                uploadPromise = this.mediaService.createMedia(uploadable.name, content, uploadable.type);
                this.viewManager.addPromiseProgressIndicator(uploadPromise, "Media library", `Uploading ${uploadable.name}...`);
            }

            const onMediaUploadedCallback = dropbucketItem.widgetFactoryResult.onMediaUploadedCallback;

            if (onMediaUploadedCallback && typeof onMediaUploadedCallback === "function") {
                //VK: Called by KO binding, so 2nd argument may be an event
                uploadPromise.then(createdMedia => onMediaUploadedCallback(createdMedia));
            }
        });
    }

    public discardDroppedContent(): void {
        this.droppedItems.removeAll();
    }
}