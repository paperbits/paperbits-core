import * as ko from "knockout";
import template from "./columnEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { ColumnModel } from "../columnModel";

@Component({
    selector: "layout-column-editor",
    template: template
})
export class ColumnEditor {
    public readonly verticalAlignment: ko.Observable<string>;
    public readonly horizontalAlignment: ko.Observable<string>;
    public readonly alignment: ko.Observable<string>;
    public readonly scrollOnOverlow: ko.Observable<boolean>;
    public readonly order: ko.Observable<number>;

    constructor(private readonly viewManager: ViewManager) {
        this.alignment = ko.observable<string>();
        this.verticalAlignment = ko.observable<string>();
        this.horizontalAlignment = ko.observable<string>();
        this.scrollOnOverlow = ko.observable<boolean>();
        this.order = ko.observable<number>();
    }
    
    @Param()
    public model: ColumnModel;

    @Event()
    public onChange: (model: ColumnModel) => void;

    @OnMounted()
    public initialize(): void {
        const viewport = this.viewManager.getViewport();

        const alignment = this.determineAlignment(viewport, this.model);
        this.alignment(alignment);

        this.scrollOnOverlow(this.model.overflowY === "scroll");

        const directions = this.alignment().split(" ");
        this.verticalAlignment(directions[0]);
        this.horizontalAlignment(directions[1]);

        const order = this.determineOrder(viewport, this.model);
        this.order(order);

        this.alignment.subscribe(this.applyChanges);
        this.scrollOnOverlow.subscribe(this.applyChanges);
        this.order.subscribe(this.applyChanges);
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private applyChanges(): void {
        const viewport = this.viewManager.getViewport();

        switch (viewport) {
            case "xl":
                this.model.alignment.xl = this.alignment();
                this.model.order.xl = this.order();
                break;

            case "lg":
                this.model.alignment.lg = this.alignment();
                this.model.order.lg = this.order();
                break;

            case "md":
                this.model.alignment.md = this.alignment();
                this.model.order.md = this.order();
                break;

            case "sm":
                this.model.alignment.sm = this.alignment();
                this.model.order.sm = this.order();
                break;

            case "xs":
                this.model.alignment.xs = this.alignment();
                this.model.order.xs = this.order();
                break;

            default:
                throw new Error("Unknown viewport");
        }

        this.model.overflowX = this.model.overflowY = this.scrollOnOverlow() ? "scroll" : null;

        this.onChange(this.model);
    }

    public alignContent(alignment: string): void {
        this.alignment(alignment);
    }

    private align(): void {
        this.alignment(`${this.verticalAlignment()} ${this.horizontalAlignment()}`);
    }

    public determineAlignment(viewport: string, model: ColumnModel): string {
        switch (viewport) {
            case "xl":
                return model.alignment.xl || this.determineAlignment("lg", model);
                break;

            case "lg":
                return model.alignment.lg || this.determineAlignment("md", model);
                break;

            case "md":
                return model.alignment.md || this.determineAlignment("sm", model);
                break;

            case "sm":
                return model.alignment.sm || this.determineAlignment("xs", model);
                break;

            case "xs":
                return model.alignment.xs || "start start";
                break;

            default:
                throw new Error("Unknown viewport");
        }
    }

    public determineOrder(viewport: string, model: ColumnModel): number {
        switch (viewport) {
            case "xl":
                return model.order.xl || this.determineOrder("lg", model);
                break;

            case "lg":
                return model.order.lg || this.determineOrder("md", model);
                break;

            case "md":
                return model.order.md || this.determineOrder("sm", model);
                break;

            case "sm":
                return model.order.sm || this.determineOrder("xs", model);
                break;

            case "xs":
                return model.order.xs || null;
                break;

            default:
                throw new Error("Unknown viewport");
        }
    }

    public toggleHorizontal(): void {
        switch (this.horizontalAlignment()) {
            case "center":
                this.horizontalAlignment("around");
                break;
            case "around":
                this.horizontalAlignment("between");
                break;
            case "between":
                this.horizontalAlignment("center");
                break;
        }
    }

    public toggleVertical(): void {
        switch (this.verticalAlignment()) {
            case "center":
                this.verticalAlignment("around");
                break;
            case "around":
                this.verticalAlignment("between");
                break;
            case "between":
                this.verticalAlignment("center");
                break;
        }
    }

    public alignLeft(): void {
        this.horizontalAlignment("start");
        this.align();
    }

    public alignRight(): void {
        this.horizontalAlignment("end");
        this.align();
    }

    public alignCenter(): void {
        if (this.horizontalAlignment() === "center" || this.horizontalAlignment() === "around" || this.horizontalAlignment() === "between") {
            this.toggleHorizontal();
        }
        else {
            this.horizontalAlignment("center");
        }

        this.align();
    }

    public alignTop(): void {
        this.verticalAlignment("start");
        this.align();
    }

    public alignBottom(): void {
        this.verticalAlignment("end");
        this.align();
    }

    public alignMiddle(): void {
        if (this.verticalAlignment() === "center" || this.verticalAlignment() === "around" || this.verticalAlignment() === "between") {
            this.toggleVertical();
        }
        else {
            this.verticalAlignment("center");
        }

        this.align();
    }
}
