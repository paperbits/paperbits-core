import * as ko from "knockout";
import template from "./search.html";
import { StyleModel } from "@paperbits/common/styles";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "search",
    template: template
})
export class SearchViewModel {
    public readonly runtimeConfig: ko.Observable<string>;
    public readonly styles: ko.Observable<StyleModel>;

    constructor() {
        this.styles = ko.observable<StyleModel>();
        this.runtimeConfig = ko.observable();
    }
}