import * as ko from "knockout";
import template from "./columnEditor.html";
import { IViewManager } from "@paperbits/common/ui";
import { IWidgetEditor } from "@paperbits/common/widgets/IWidgetEditor";
import { Component } from "@paperbits/common/ko/decorators";
import { ColumnModel } from "../columnModel";

@Component({
    selector: "layout-column-editor",
    template: template,
    injectable: "columnEditor"
})
export class ColumnEditor implements IWidgetEditor {
    private column: ColumnModel;
    private applyChangesCallback: () => void;
    private readonly verticalAlignment: KnockoutObservable<string>;
    private readonly horizontalAlignment: KnockoutObservable<string>;

    public readonly alignment: KnockoutObservable<string>;
    public readonly scrollOnOverlow: KnockoutObservable<boolean>;
    public readonly order: KnockoutObservable<number>;

    constructor(private readonly viewManager: IViewManager) {
        this.alignLeft.bind(this);
        this.alignRight.bind(this);
        this.alignCenter.bind(this);
        this.alignTop.bind(this);
        this.alignBottom.bind(this);
        this.alignMiddle.bind(this);

        this.viewManager = viewManager;
        this.setWidgetModel = this.setWidgetModel.bind(this);

        this.alignment = ko.observable<string>();
        this.alignment.subscribe(this.onChange.bind(this));

        this.verticalAlignment = ko.observable<string>();
        this.horizontalAlignment = ko.observable<string>();

        this.scrollOnOverlow = ko.observable<boolean>();
        this.scrollOnOverlow.subscribe(this.onChange.bind(this));

        this.order = ko.observable<number>();
        this.order.subscribe(this.onChange.bind(this));
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private onChange(): void {
        if (!this.applyChangesCallback) {
            return;
        }

        const viewport = this.viewManager.getViewport();

        switch (viewport) {
            case "xl":
                this.column.alignment.xl = this.alignment();
                this.column.order.xl = this.order();
                break;

            case "lg":
                this.column.alignment.lg = this.alignment();
                this.column.order.lg = this.order();
                break;

            case "md":
                this.column.alignment.md = this.alignment();
                this.column.order.md = this.order();
                break;

            case "sm":
                this.column.alignment.sm = this.alignment();
                this.column.order.sm = this.order();
                break;

            case "xs":
                this.column.alignment.xs = this.alignment();
                this.column.order.xs = this.order();
                break;

            default:
                throw new Error("Unknown viewport");
        }

        this.column.overflowX = this.column.overflowY = this.scrollOnOverlow() ? "scroll" : null;

        this.applyChangesCallback();
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
                throw "Unknown viewport";
        }
    }

    public setWidgetModel(column: ColumnModel, applyChangesCallback?: () => void): void {
        this.column = column;

        const viewport = this.viewManager.getViewport();

        const alignment = this.determineAlignment(viewport, column);
        this.alignment(alignment);

        this.scrollOnOverlow(column.overflowY === "scroll");

        const directions = this.alignment().split(" ");
        this.verticalAlignment(directions[0]);
        this.horizontalAlignment(directions[1]);

        const order = this.determineOrder(viewport, column);
        this.order(order);

        this.applyChangesCallback = applyChangesCallback;
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
