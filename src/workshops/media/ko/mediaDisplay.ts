import template from "./mediaDisplay.html";
import { Component, Param } from "@paperbits/common/ko/decorators";
import { MediaItem } from "./mediaItem";


@Component({
    selector: "media-display",
    template: template
})
export class MediaDisplay {
    @Param()
    public readonly item: MediaItem;
}