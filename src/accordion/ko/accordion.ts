import * as ko from "knockout";
import template from "./accordion.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";
import { AccordionItemViewModel } from "./accordionItemViewModel";

@Component({
    selector: "accordion",
    template: template
})
export class AccordionViewModel {
    public styles: ko.Observable<StyleModel>;
    public accordionItems: ko.ObservableArray<AccordionItemViewModel>;

    constructor() {
        this.accordionItems = ko.observableArray<any>();
        this.styles = ko.observable<StyleModel>();
    }
}
