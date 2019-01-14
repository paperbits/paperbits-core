import * as ko from "knockout";
import template from "./column.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "layout-column",
    template: template,
    injectable: "column"
})
export class ColumnViewModel {
    public widgets: KnockoutObservableArray<Object>;
    public css: KnockoutComputed<string>;
    public sizeXs: KnockoutObservable<string>;
    public sizeSm: KnockoutObservable<string>;
    public sizeMd: KnockoutObservable<string>;
    public sizeLg: KnockoutObservable<string>;
    public sizeXl: KnockoutObservable<string>;
    public alignmentXs: KnockoutObservable<string>;
    public alignmentSm: KnockoutObservable<string>;
    public alignmentMd: KnockoutObservable<string>;
    public alignmentLg: KnockoutObservable<string>;
    public alignmentXl: KnockoutObservable<string>;

    public offsetXs: KnockoutObservable<string>;
    public offsetSm: KnockoutObservable<string>;
    public offsetMd: KnockoutObservable<string>;
    public offsetLg: KnockoutObservable<string>;
    public offsetXl: KnockoutObservable<string>;

    public orderXs: KnockoutObservable<number>;
    public orderSm: KnockoutObservable<number>;
    public orderMd: KnockoutObservable<number>;
    public orderLg: KnockoutObservable<number>;
    public orderXl: KnockoutObservable<number>;
    public overflow: KnockoutComputed<Object>;
    public overflowX: KnockoutObservable<string>;
    public overflowY: KnockoutObservable<string>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.sizeXs = ko.observable<string>();
        this.sizeSm = ko.observable<string>();
        this.sizeMd = ko.observable<string>();
        this.sizeLg = ko.observable<string>();
        this.sizeXl = ko.observable<string>();

        this.alignmentXs = ko.observable<string>();
        this.alignmentSm = ko.observable<string>();
        this.alignmentMd = ko.observable<string>();
        this.alignmentLg = ko.observable<string>();
        this.alignmentXl = ko.observable<string>();

        this.offsetXs = ko.observable<string>();
        this.offsetSm = ko.observable<string>();
        this.offsetMd = ko.observable<string>();
        this.offsetLg = ko.observable<string>();
        this.offsetXl = ko.observable<string>();

        this.overflowX = ko.observable<string>();
        this.overflowY = ko.observable<string>();

        this.orderXs = ko.observable<number>();
        this.orderSm = ko.observable<number>();
        this.orderMd = ko.observable<number>();
        this.orderLg = ko.observable<number>();
        this.orderXl = ko.observable<number>();

        this.css = ko.computed(() => {
            const classes = [];

            if (this.sizeXs()) {
                classes.push(this.getSizeClass(this.sizeXs(), "xs"));
            }

            if (this.sizeSm()) {
                classes.push(this.getSizeClass(this.sizeSm(), "sm"));
            }

            if (this.sizeMd()) {
                classes.push(this.getSizeClass(this.sizeMd(), "md"));
            }

            if (this.sizeLg()) {
                classes.push(this.getSizeClass(this.sizeLg(), "lg"));
            }

            if (this.sizeXl()) {
                classes.push(this.getSizeClass(this.sizeXl(), "xl"));
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

            if (this.offsetXs()) {
                classes.push(this.getOffsetClass(this.offsetXs(), "xs"));
            }

            if (this.offsetSm()) {
                classes.push(this.getOffsetClass(this.offsetSm(), "sm"));
            }

            if (this.offsetMd()) {
                classes.push(this.getOffsetClass(this.offsetMd(), "md"));
            }

            if (this.offsetLg()) {
                classes.push(this.getOffsetClass(this.offsetLg(), "lg"));
            }

            if (this.offsetXl()) {
                classes.push(this.getOffsetClass(this.offsetXl(), "xl"));
            }

            if (this.orderXs()) {
                classes.push(this.getOrderClass(this.orderXs(), "xs"));
            }

            if (this.orderSm()) {
                classes.push(this.getOrderClass(this.orderSm(), "sm"));
            }

            if (this.orderMd()) {
                classes.push(this.getOrderClass(this.orderMd(), "md"));
            }

            if (this.orderLg()) {
                classes.push(this.getOrderClass(this.orderLg(), "lg"));
            }

            if (this.orderXl()) {
                classes.push(this.getOrderClass(this.orderXl(), "xl"));
            }

            return classes.join(" ");
        });

        this.overflow = ko.computed(() => {
            return {
                x: this.overflowX(),
                y: this.overflowY()
            };
        });
    }

    private getSizeClass(size: string, targetBreakpoint: string): string {
        let breakpoint = "";

        if (targetBreakpoint !== "xs") {
            breakpoint = targetBreakpoint + "-";
        }
      
        if (size === "auto") {
            size = "";
        }

        return `col-${breakpoint}${size}`;
    }

    private getOffsetClass(offset: string, targetBreakpoint: string): string {
        let breakpoint = "";

        if (targetBreakpoint !== "xs") {
            breakpoint = targetBreakpoint + "-";
        }

        return `offset-${breakpoint}${offset}`;
    }

    private getOrderClass(order: number, targetBreakpoint: string): string {
        let breakpoint = "";

        if (targetBreakpoint !== "xs") {
            breakpoint = targetBreakpoint + "-";
        }

        return `order-${breakpoint}${order}`;
    }

    private getAlignmentClass(alignmentString: string, targetBreakpoint: string): string {
        const alignment = alignmentString.split(" ");
        const vertical = alignment[0];
        const horizontal = alignment[1];

        let breakpoint = "";

        if (targetBreakpoint !== "xs") {
            breakpoint = targetBreakpoint + "-";
        }

        return `align-content-${breakpoint}${horizontal} align-items-${breakpoint}${horizontal} justify-content-${breakpoint}${vertical}`;
    }
}
