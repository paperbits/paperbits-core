import { ILightbox } from "@paperbits/common/ui/ILightbox";
import * as basicLightbox from "basiclightbox";

export class Lightbox implements ILightbox {
    public show(url: string, fileName: string): void {
        const lightbox = basicLightbox.create(`
            <img class="lightbox-img" src="${url}">
            <div class="lightbox-title">${fileName}</div>
        `);
        lightbox.show();
    }
}