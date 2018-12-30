import * as ko from "knockout";
import template from "./card.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "card",
    template: template,
    injectable: "card"
})
export class CardViewModel {
    public widgets: KnockoutObservableArray<Object>;
    public css: KnockoutComputed<string>;
    public alignmentXs: KnockoutObservable<string>;
    public alignmentSm: KnockoutObservable<string>;
    public alignmentMd: KnockoutObservable<string>;
    public alignmentLg: KnockoutObservable<string>;
    public alignmentXl: KnockoutObservable<string>;
    public overflow: KnockoutComputed<Object>;
    public overflowX: KnockoutObservable<string>;
    public overflowY: KnockoutObservable<string>;

    constructor() {
        this.widgets = ko.observableArray<Object>();

        this.alignmentXs = ko.observable<string>();
        this.alignmentSm = ko.observable<string>();
        this.alignmentMd = ko.observable<string>();
        this.alignmentLg = ko.observable<string>();
        this.alignmentXl = ko.observable<string>();

        this.overflowX = ko.observable<string>();
        this.overflowY = ko.observable<string>();


        this.css = ko.computed(() => {
            const classes = [];

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

            return classes.join(" ");
        });

        this.overflow = ko.computed(() => {
            return {
                x: this.overflowX(),
                y: this.overflowY()
            };
        });
    }

    private getAlignmentClass(alignmentString: string, targetBreakpoint: string): string {
        const alignment = alignmentString.split(" ");
        const vertical = alignment[0];
        const horizontal = alignment[1];

        let breakpoint = "";

        if (targetBreakpoint !== "xs") {
            breakpoint = targetBreakpoint + "-";
        }

        return `align-content-${breakpoint}${vertical} align-items-${breakpoint}${vertical} justify-content-${breakpoint}${horizontal}`;
    }
}
