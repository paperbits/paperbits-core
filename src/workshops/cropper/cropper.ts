import * as ko from "knockout";
import * as Cropper from "cropperjs";
import template from "./cropper.html";
import { Component, Param } from "@paperbits/common/ko/decorators";
import { EventManager } from "@paperbits/common/events";
import { IMediaService } from "@paperbits/common/media";
import { ViewManager } from "@paperbits/common/ui";
import { MediaItem } from "../media/ko/mediaItem";

export class CropperBindingHandler {
    constructor(eventManager: EventManager) {
        ko.bindingHandlers["cropper"] = {
            init: (imageElement: HTMLImageElement, valueAccessor) => {
                const observable = valueAccessor();

                const cropperInstance = new (<any>Cropper)(imageElement, {
                    // aspectRatio: 1,
                    viewMode: 1,
                    responsive: true,
                    ready: () => {
                        this["croppable"] = true;
                    }
                });

                observable(cropperInstance);

                const onResize = () => {
                    cropperInstance["resize"]();
                };

                eventManager.addEventListener("onEditorResize", onResize);

                ko.utils.domNodeDisposal.addDisposeCallback(imageElement, () => {
                    eventManager.removeEventListener("onEditorResize", onResize);
                });
            }
        };
    }
}


@Component({
    selector: "picture-cropper",
    template: template
})
export class PictureCropper {
    public cropperInstance: ko.Observable<any>;

    @Param()
    public readonly mediaItem: MediaItem;

    constructor(
        private readonly mediaService: IMediaService,
        private readonly viewManager: ViewManager
    ) {
        this.setMoveMode = this.setMoveMode.bind(this);
        this.setCropMode = this.setCropMode.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.rotateLeft = this.rotateLeft.bind(this);
        this.rotateRight = this.rotateRight.bind(this);
        this.flipHorizontally = this.flipHorizontally.bind(this);
        this.flipVertically = this.flipVertically.bind(this);
        this.crop = this.crop.bind(this);
        this.clear = this.clear.bind(this);
        this.cropperInstance = ko.observable(null);
    }

    public getRoundedCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const width = sourceCanvas.width;
        const height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;

        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = "destination-in";
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();

        return canvas;
    }

    public setMoveMode(): void {
        this.cropperInstance().setDragMode("move");
    }

    public setCropMode(): void {
        this.cropperInstance().setDragMode("crop");
    }

    public zoomIn(): void {
        this.cropperInstance().zoom(0.1);
    }

    public zoomOut(): void {
        this.cropperInstance().zoom(-0.1);
    }

    public rotateLeft(): void {
        this.cropperInstance().rotate(-45);
    }

    public rotateRight(): void {
        this.cropperInstance().rotate(45);
    }

    public flipHorizontally(): void {
        this.cropperInstance().scaleX(-this.cropperInstance().imageData.scaleX);
    }

    public flipVertically(): void {
        this.cropperInstance().scaleY(-this.cropperInstance().imageData.scaleY);
    }

    public crop(): void {
        const cropper = this.cropperInstance();
        const canvas = <HTMLCanvasElement>cropper.getCroppedCanvas();

        canvas.toBlob(async (blob) => {
            const reader = new FileReader();
            reader.addEventListener("loadend", async () => {
                const arrayBuffer = <ArrayBuffer>reader.result;
                await this.updateMediaContent(new Uint8Array(arrayBuffer));
            });
            reader.readAsArrayBuffer(blob);
        });
    }

    private async updateMediaContent(content: Uint8Array): Promise<void> {
        const uploadPromise = this.mediaService.updateMediaContent(this.mediaItem.toMedia(), content);
        uploadPromise.then(updatedItem => {
            this.mediaItem.downloadUrl(updatedItem.downloadUrl);
            const cropper = this.cropperInstance();
            cropper.replace(updatedItem.downloadUrl);
        });
        await this.viewManager.notifyProgress(uploadPromise, "Media library", `Updating ${this.mediaItem.fileName()}...`);
    }

    public clear(): void {
        this.cropperInstance().clear();
    }
}