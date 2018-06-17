import * as ko from "knockout";
import * as MediaUtils from "@paperbits/common/media/mediaUtils";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetOrder } from '@paperbits/common/editing';
import { IWidgetFactoryResult } from "@paperbits/common/editing";

export class MediaItem {
    public key: string;
    public permalinkKey?: string;
    public blobKey: string;
    public widgetOrder: IWidgetOrder;
    public element: HTMLElement;

    public hasFocus: KnockoutObservable<boolean>;
    public downloadUrl: KnockoutObservable<string>;
    public thumbnailUrl: KnockoutObservable<string>;

    public permalinkUrl: KnockoutObservable<string>;
    public fileName: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public keywords: KnockoutObservable<string>;
    public contentType: KnockoutObservable<string>;
    public widgetFactoryResult: IWidgetFactoryResult;

    constructor(mediaContract: MediaContract) {
        this.key = mediaContract.key;
        this.blobKey = mediaContract.blobKey;
        this.permalinkKey = mediaContract.permalinkKey;
        this.permalinkUrl = ko.observable<string>();
        this.fileName = ko.observable<string>(mediaContract.filename);
        this.description = ko.observable<string>(mediaContract.description);
        this.keywords = ko.observable<string>(mediaContract.keywords);
        this.contentType = ko.observable<string>(mediaContract.contentType);
        this.hasFocus = ko.observable<boolean>();
        this.thumbnailUrl = ko.observable<string>();
        this.downloadUrl = ko.observable<string>(mediaContract.downloadUrl);

        this.getThumbnail(mediaContract);
    }

    private async getThumbnail(mediaContract: MediaContract): Promise<void> {
        if (mediaContract.contentType.startsWith("video")) {
            const dataUrl = await MediaUtils.getVideoThumbnailAsDataUrlFromUrl(mediaContract.downloadUrl);
            this.thumbnailUrl(dataUrl);
        }
        else if (mediaContract.contentType.startsWith("image")) {
            this.thumbnailUrl(mediaContract.downloadUrl);
        }
        else {
            this.thumbnailUrl(null); // TODO: Placeholder?
        }
    }

    public toMedia(): MediaContract {
        return {
            key: this.key,
            blobKey: this.blobKey,
            filename: this.fileName(),
            description: this.description(),
            keywords: this.keywords(),
            contentType: this.contentType(),
            downloadUrl: this.downloadUrl(),
            permalinkKey: this.permalinkKey
        }
    }
}