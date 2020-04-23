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

    @Param()
    public readonly item: MediaItem;
}