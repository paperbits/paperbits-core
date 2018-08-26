import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import template from "./cropper.html";
import { IViewManager } from "@paperbits/common/ui";
import { Component } from "../../ko/component";


import * as Cropper from "cropperjs";
import { IEventManager } from "@paperbits/common/events";

export class CropperBindingHandler {

    constructor(eventManager: IEventManager) {
        ko.bindingHandlers["cropper"] = {
            init: (imageElement: HTMLImageElement, valueAccessor) => {
                const observable = valueAccessor();
                const cropperInstance = new Cropper.default(imageElement, {
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
    template: template,
    injectable: "pictureCropper"
})
export class PictureCropper {
    public cropperInstance: KnockoutObservable<any>;
    public source: KnockoutObservable<string>;

    constructor(
        private readonly viewManager: IViewManager,
        private readonly sourceUrl: string
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

        this.source = ko.observable(sourceUrl);
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
        throw new Error("This functionality is not ready yet.");

        const cropper = this.cropperInstance();

        cropper.getCroppedCanvas().toBlob(async (blob) => {
            // console.log(await Utils.readBlobAsDataUrl(blob));

            // TODO: Save back to media library
        });
    }

    public clear(): void {
        this.cropperInstance().clear();
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}