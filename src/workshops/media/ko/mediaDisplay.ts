import * as ko from "knockout";
import template from "./mediaDisplay.html";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { Style, StyleSheet, StyleRule } from "@paperbits/common/styles";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { MediaItem } from "./mediaItem";


@Component({
    selector: "media-display",
    template: template
})
export class MediaDisplay {

    public media: ko.Observable<MediaItem>;

    @Param()
    public readonly item: MediaItem;

    @Event()
    public readonly onSelect: (gradient: MediaItem) => void;

    constructor() {
        this.media = ko.observable<MediaItem>();
    }

    @OnMounted()s
    public async initialize(): Promise<void> {
        this.media(this.item);
    }
}