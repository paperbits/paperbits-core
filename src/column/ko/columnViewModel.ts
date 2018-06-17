import * as ko from "knockout";
import template from "./column.html";
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "layout-column",
    template: template,
    injectable: "column",
    postprocess: (element: Node, viewModel) => {
        // TODO: Get rid of hack!
        if (element.nodeName == "#comment") {
            do {
                element = element.nextSibling;
            }
            while (element != null && element.nodeName == "#comment")
        }

        ko.applyBindingsToNode(element, {
            layoutcolumn: {},
            css: viewModel.css
        });
    }
})
export class ColumnViewModel {
    public widgets: KnockoutObservableArray<Object>;
    public css: KnockoutComputed<string>;
    public sizeSm: KnockoutObservable<number>;
    public sizeMd: KnockoutObservable<number>;
    public sizeLg: KnockoutObservable<number>;
    public sizeXl: KnockoutObservable<number>;
    public alignmentXs: KnockoutObservable<string>;
    public alignmentSm: KnockoutObservable<string>;
    public alignmentMd: KnockoutObservable<string>;
    public alignmentLg: KnockoutObservable<string>;
    public alignmentXl: KnockoutObservable<string>;
    public orderXs: KnockoutObservable<number>;
    public orderSm: KnockoutObservable<number>;
    public orderMd: KnockoutObservable<number>;
    public orderLg: KnockoutObservable<number>;
    public orderXl: KnockoutObservable<number>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.sizeSm = ko.observable<number>();
        this.sizeMd = ko.observable<number>();
        this.sizeLg = ko.observable<number>();
        this.sizeXl = ko.observable<number>();

        this.alignmentXs = ko.observable<string>();
        this.alignmentSm = ko.observable<string>();
        this.alignmentMd = ko.observable<string>();
        this.alignmentLg = ko.observable<string>();
        this.alignmentXl = ko.observable<string>();

        this.orderXs = ko.observable<number>();
        this.orderSm = ko.observable<number>();
        this.orderMd = ko.observable<number>();
        this.orderLg = ko.observable<number>();
        this.orderXl = ko.observable<number>();

        this.css = ko.computed(() => {
            let classes = [];

            // There's no XS size

            if (this.sizeSm()) {
                classes.push("col-sm-" + this.sizeSm());
            }

            if (this.sizeMd()) {
                classes.push("col-md-" + this.sizeMd());
            }

            if (this.sizeLg()) {
                classes.push("col-lg-" + this.sizeLg());
            }

            if (this.sizeXl()) {
                classes.push("col-xl-" + this.sizeXl());
            }

            if (this.alignmentXs()) {
                classes.push(this.getAlignmentClass(this.alignmentXs(), "xs"));
            }

            if (this.alignmentSm()) {
                classes.push(this.getAlignmentClass(this.alignmentSm(), "sm"));
            }

            if (this.alignmentMd()) {
                classes.push(this.getAlignmentClass(this.alignmentMd(), "md"));
            }

            if (this.alignmentLg()) {
                classes.push(this.getAlignmentClass(this.alignmentLg(), "lg"));
            }

            if (this.alignmentXl()) {
                classes.push(this.getAlignmentClass(this.alignmentXl(), "xl"));
            }

            if (this.orderXs()) {
                classes.push(this.getOrderClass(this.orderXs(), "xs"))
            }

            if (this.orderSm()) {
                classes.push(this.getOrderClass(this.orderSm(), "sm"))
            }

            if (this.orderMd()) {
                classes.push(this.getOrderClass(this.orderMd(), "md"))
            }

            if (this.orderLg()) {
                classes.push(this.getOrderClass(this.orderLg(), "lg"))
            }

            if (this.orderXl()) {
                classes.push(this.getOrderClass(this.orderXl(), "xl"))
            }

            return classes.join(" ");
        });
    }

    private getOrderClass(order: number, targetSize: string): string {
        let size = "";

        if (targetSize !== "xs") {
            size = targetSize + "-";
        }

        return `order-${size}${order}`;
    }

    private getAlignmentClass(alignmentString: string, targetSize: string): string {
        const alignment = alignmentString.split(" ");
        const vertical = alignment[0];
        const horizontal = alignment[1];
        let size = "";

        if (targetSize !== "xs") {
            size = targetSize + "-";
        }

        return `align-content-${size}${vertical} align-items-${size}${vertical} justify-content-${size}${horizontal}`;
    }
}
