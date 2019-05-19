import * as ko from "knockout";
import template from "./gridCellEditor.html";
import { IViewManager } from "@paperbits/common/ui";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { GridCellModel } from "../gridCellModel";
import * as Objects from "@paperbits/common/objects";

@Component({
    selector: "grid-cell-editor",
    template: template,
    injectable: "gridCellEditor"
})
export class GridCellEditor {
    public readonly verticalAlignment: ko.Observable<string>;
    public readonly horizontalAlignment: ko.Observable<string>;
    public readonly alignment: ko.Observable<string>;
    public readonly scrollOnOverlow: ko.Observable<boolean>;

    constructor(private readonly viewManager: IViewManager) {
        this.alignment = ko.observable<string>();
        this.verticalAlignment = ko.observable<string>();
        this.horizontalAlignment = ko.observable<string>();
        this.scrollOnOverlow = ko.observable<boolean>();
    }

    @Param()
    public model: GridCellModel;

    @Event()
    public onChange: (model: GridCellModel) => void;

    @OnMounted()
    public initialize(): void {
        const viewport = this.viewManager.getViewport();

        const overflowStyle = <any>Objects.getObjectAt(`styles/instance/grid-cell/${viewport}/overflow`, this.model);

        if (overflowStyle && overflowStyle.vertical) {
            this.scrollOnOverlow(true);
        }
        else {
            this.scrollOnOverlow(false);
        }

        const alignmentStyle = <any>Objects.getObjectAt(`styles/instance/grid-cell/${viewport}/alignment`, this.model);

        if (alignmentStyle) {
            this.verticalAlignment(alignmentStyle.vertical);
            this.horizontalAlignment(alignmentStyle.horizontal);
        }

        this.alignment.subscribe(this.applyChanges);
        this.scrollOnOverlow.subscribe(this.applyChanges);
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private applyChanges(): void {
        const viewport = this.viewManager.getViewport();

        const alignmentStyle = {
            vertical: this.verticalAlignment(),
            horizontal: this.horizontalAlignment()
        };

        Objects.setValue(`styles/instance/grid-cell/${viewport}/alignment`, this.model, alignmentStyle);

        const overflowStyle = {
            vertical: this.scrollOnOverlow() ? "auto" : undefined,
            horizontal: this.scrollOnOverlow() ? "auto" : undefined
        };

        Objects.setValue(`styles/instance/grid-cell/${viewport}/overflow`, this.model, overflowStyle);

        this.onChange(this.model);
    }

    public alignContent(alignment: string): void {
        this.alignment(alignment);
    }

    private align(): void {
        this.alignment(`${this.verticalAlignment()} ${this.horizontalAlignment()}`);
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
