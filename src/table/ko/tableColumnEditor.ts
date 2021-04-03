import * as ko from "knockout";
import template from "./tableColumnEditor.html";
import { StyleHelper, StyleService } from "@paperbits/styles";
import { SizeUnits, StyleSizeValue } from "@paperbits/styles/plugins";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TableModel } from "../tableModel";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";


@Component({
    selector: "table-column-editor",
    template: template
})
export class TableColumnEditor {
    public readonly width: ko.Observable<string | number>;

    constructor(private readonly styleService: StyleService) {
        this.width = ko.observable();
    }

    @Param()
    public model: TableModel;

    @Param()
    public columnIndex: number;

    @Event()
    public onChange: (model: TableModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const width = StyleSizeValue.parse(this.model.styles.instance.grid.xs.cols[this.columnIndex]);

        if (width.units === SizeUnits.pixels) {
            this.width(width.value);
        }

        this.width
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);
    }

    private applyChanges(): void {
        const numOfColumns = 3;
        const columnIndex = this.columnIndex;
        // const columnWidthValue = this.model.styles.instance.grid.xs.cols[columnIndex];

        if (!this.columnIndex) {
            this.columnIndex = 0;
        }

        const width = this.width();
        const value = StyleHelper.isValueEmpty(width)
            ? "1fr"
            : `${width}px`;

        this.model.styles.instance.grid.xs.cols[this.columnIndex] = value;

        this.onChange(this.model);
    }
}