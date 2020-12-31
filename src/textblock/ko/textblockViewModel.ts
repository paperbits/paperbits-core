import * as ko from "knockout";
import { Component } from "@paperbits/common/ko/decorators";
import { BlockModel } from "@paperbits/common/text/models";
import template from "./textblock.html";

@Component({
    selector: "paperbits-text",
    template: template
})
export class TextblockViewModel {
    public readonly state: ko.Observable<BlockModel[]>;

    constructor() {
        this.state = ko.observable();
    }
}