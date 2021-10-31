import * as ko from "knockout";
import * as _ from "lodash";
import template from "./textStyleSelector.html";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { StyleService } from "@paperbits/styles";

@Component({
    selector: "text-style-selector",
    template: template
})
export class TextStyleSelector {
    constructor(private readonly styleService: StyleService) {
        this.styles = ko.observableArray();
    }

    public styles: ko.ObservableArray;

    @Event()
    public onSelect: (style: any) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const textVariarions = await this.styleService.getTextVariations();
        this.styles(textVariarions);
    }

    public setTextStyle(style: any): void {
        if (this.onSelect) {
            this.onSelect(style);
        }
    }
}