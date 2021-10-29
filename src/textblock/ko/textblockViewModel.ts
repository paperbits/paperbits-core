import * as ko from "knockout";
import { Component } from "@paperbits/common/ko/decorators";
import { BlockModel } from "@paperbits/common/text/models";
import template from "./textblock.html";
import { StyleModel } from "@paperbits/common/styles";

@Component({
    selector: "paperbits-text",
    template: template
})
export class TextblockViewModel {
    public readonly content: ko.Observable<BlockModel[]>;
    public readonly styles: ko.Observable<StyleModel>;

    constructor() {
        this.content = ko.observable();
        this.styles = ko.observable();
    }
}