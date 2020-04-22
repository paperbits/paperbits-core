﻿import * as ko from "knockout";
import * as MediaUtils from "@paperbits/common/media/mediaUtils";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetOrder, IWidgetFactoryResult } from "@paperbits/common/editing";
import { HyperlinkModel } from "@paperbits/common/permalinks";

export const defaultFileName: string = "media.svg";
export const defaultURL: string = "https://cdn.paperbits.io/images/logo.svg";

export class MediaItem {
    public key: string;
    public blobKey: string;
    public widgetOrder: IWidgetOrder;
    public downloadUrl: ko.Observable<string>;
    public thumbnailUrl: ko.Observable<string>;
    public permalink: ko.Observable<string>;
    public fileName: ko.Observable<string>;
    public description: ko.Observable<string>;
    public keywords: ko.Observable<string>;
    public contentType: ko.Observable<string>;
    public widgetFactoryResult: IWidgetFactoryResult<any>;
    public isSelected: ko.Observable<boolean>;

    constructor(mediaContract: MediaContract) {
        this.key = mediaContract.key;
        this.blobKey = mediaContract.blobKey;
        this.fileName = ko.observable<string>(mediaContract.fileName);
        this.description = ko.observable<string>(mediaContract.description);
        this.keywords = ko.observable<string>(mediaContract.keywords);
        this.permalink = ko.observable<string>(mediaContract.permalink);
        this.contentType = ko.observable<string>(mediaContract.mimeType);
        this.thumbnailUrl = ko.observable<string>();
        this.downloadUrl = ko.observable<string>(mediaContract.downloadUrl);
        this.isSelected = ko.observable<boolean>();

        this.getThumbnail(mediaContract);
    }

    private async getThumbnail(mediaContract: MediaContract): Promise<void> {
        if (mediaContract.mimeType.startsWith("video")) {
            const dataUrl = await MediaUtils.getVideoThumbnailAsDataUrlFromUrl(mediaContract.downloadUrl);
            this.thumbnailUrl(dataUrl);
        }
        else if (mediaContract.mimeType.startsWith("image")) {
            this.thumbnailUrl(mediaContract.downloadUrl);
        }
        else {
            this.thumbnailUrl(null); // TODO: Placeholder?
        }
    }

    public isDefaultFileName(): boolean {
        return this.fileName() === defaultFileName;
    }

    public isDefaultUrl(): boolean {
        return this.downloadUrl() === defaultURL;
    }

    public updateDefault(newName: string): void {
        this.fileName(newName);
        this.permalink(this.permalink().replace(defaultFileName, newName));
        this.thumbnailUrl(this.downloadUrl());
    }

    public toMedia(): MediaContract {
        return {
            key: this.key,
            blobKey: this.blobKey,
            fileName: this.fileName(),
            description: this.description(),
            keywords: this.keywords(),
            mimeType: this.contentType(),
            downloadUrl: this.downloadUrl(),
            permalink: this.permalink()
        };
    }

    public getHyperlink(): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = this.fileName();
        hyperlinkModel.targetKey = this.key;
        hyperlinkModel.href = this.permalink();

        return hyperlinkModel;
    }
}