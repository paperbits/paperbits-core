import * as ko from "knockout";
import template from "./accordionItemSelector.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { AccordionItemModel } from "../accordionModel";


@Component({
    selector: "accordion-item-selector",
    template: template
})
export class AccordionItemSelector {
    public readonly accordionItems: ko.Observable<AccordionItemModel[]>;
    public readonly activeAccordionItem: ko.Observable<AccordionItemModel>;

    constructor() {
        this.accordionItems = ko.observable([]);
        this.activeAccordionItem = ko.observable();
    }

    @Param()
    public activeAccordionItemModel: AccordionItemModel = null;

    @Param()
    public accordionItemModels: AccordionItemModel[];

    @Event()
    public onSelect: (item: AccordionItemModel) => void;

    @Event()
    public onCreate: () => void;

    @OnMounted()
    public initialize(): void {
        this.accordionItems(this.accordionItemModels);
        this.activeAccordionItem(this.activeAccordionItemModel);
    }

    public selectAccordionItem(item: AccordionItemModel): void {
        if (this.onSelect) {
            this.onSelect(item);
        }
    }

    public addAccordionItem(): void {
        if (this.onCreate) {
            this.onCreate();
        }
    }
}
