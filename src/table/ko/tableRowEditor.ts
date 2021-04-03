import * as ko from "knockout";
import template from "./tableRowEditor.html";
import { StyleHelper, StyleService } from "@paperbits/styles";
import { SizeUnits, StyleSizeValue } from "@paperbits/styles/plugins";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TableModel } from "../tableModel";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { TableCellModel } from "../../table-cell";


@Component({
    selector: "table-row-editor",
    template: template
})
export class TableRowEditor {
    public readonly height: ko.Observable<string | number>;

    constructor(private readonly styleService: StyleService) {
        this.height = ko.observable();
    }

    @Param()
    public model: TableModel;

    @Param()
    public rowIndex: number;

    @Event()
    public onChange: (model: TableModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const height = StyleSizeValue.parse(this.model.styles.instance.grid.xs.rows[this.rowIndex]);

        if (height.units === SizeUnits.pixels) {
            this.height(height.value);
        }

        this.height
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);
    }

    private applyChanges(): void {
        if (!this.rowIndex) {
            this.rowIndex = 0;
        }

        const height = this.height();
        const value = StyleHelper.isValueEmpty(height)
            ? "1fr"
            : `${height}px`;

        this.model.styles.instance.grid.xs.rows[this.rowIndex] = value;

        this.onChange(this.model);
    }
}