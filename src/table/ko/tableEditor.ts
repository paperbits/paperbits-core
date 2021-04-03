import * as ko from "knockout";
import template from "./tableEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { TableModel } from "../tableModel";
import { TableCellModel } from "../../table-cell";


@Component({
    selector: "table-editor",
    template: template
})
export class TableEditor {
    public readonly numOfCols: ko.Observable<number>;
    public readonly numOfRows: ko.Observable<number>;

    constructor() {
        this.numOfCols = ko.observable();
        this.numOfRows = ko.observable();
    }

    @Param()
    public model: TableModel;

    @Event()
    public onChange: (model: TableModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.numOfCols(this.model.numOfCols);
        this.numOfRows(this.model.numOfRows);

        this.numOfCols
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);
            
        this.numOfRows
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);
    }

    private applyChanges(): void {
        const numOfCols = this.numOfCols();
        const numOfRows = this.numOfRows();

        if (numOfCols > this.model.numOfCols) {
            const missingCols = numOfCols - this.model.numOfCols;

            for (let i = 0; i < missingCols; i++) {
                this.addColumn(this.model.numOfCols);
            }
        }

        if (numOfCols < this.model.numOfCols) {
            const colsToDelete = this.model.numOfCols - numOfCols;

            for (let i = 0; i < colsToDelete; i++) {
                this.removeColumn(this.model.numOfCols - 1);
            }
        }

        if (numOfRows > this.model.numOfRows) {
            const rowsToAdd = numOfRows - this.model.numOfRows;

            for (let i = 0; i < rowsToAdd; i++) {
                this.addRow(this.model.numOfRows);
            }
        }

        if (numOfRows < this.model.numOfRows) {
            const rowsToDelete = this.model.numOfRows - numOfRows;

            for (let i = 0; i < rowsToDelete; i++) {
                this.removeRow(this.model.numOfRows - 1);
            }
        }

        this.onChange(this.model);
    }

    private removeColumn(columnIndex: number): void {
        const currentNumOfCols = this.model.numOfCols;

        this.model.styles.instance.grid.xs.cols.splice(columnIndex, 1);
        this.model.numOfCols--;

        for (let rowIndex = this.model.numOfRows; rowIndex >= 0; rowIndex--) {
            const cellIndex = (rowIndex * currentNumOfCols) + columnIndex;
            this.model.widgets.splice(cellIndex, 1);
        }
    }

    private addColumn(columnIndex: number): void {
        const currentNumOfCols = this.model.numOfCols;

        this.model.styles.instance.grid.xs.cols.push("1fr");
        this.model.numOfCols++;

        for (let rowIndex = 0; rowIndex < this.model.numOfRows; rowIndex++) {
            const cellIndex = (rowIndex * currentNumOfCols) + columnIndex + rowIndex;
            const cell = this.createCell(columnIndex + 1, rowIndex + 1);
            this.model.widgets.splice(cellIndex, 0, cell);
        }
    }

    private removeRow(rowIndex: number): void {
        this.model.styles.instance.grid.xs.rows.splice(rowIndex, 1);
        this.model.numOfRows--;

        const rowStart = rowIndex * this.model.numOfCols;
        this.model.widgets.splice(rowStart, this.model.numOfCols);
    }

    private addRow(rowIndex: number): void {
        this.model.styles.instance.grid.xs.rows.push("1fr");
        this.model.numOfRows++;

        for (let columnIndex = 0; columnIndex < this.model.numOfCols; columnIndex++) {
            const cell = this.createCell(columnIndex + 1, rowIndex + 1);
            this.model.widgets.push(cell);
        }
    }

    private createCell(columnIndex: number, rowIndex: number): TableCellModel {
        const cell = new TableCellModel();
        cell.role = "cell";

        cell.styles = {
            instance: {
                "grid-cell": {
                    xs: {
                        position: {
                            col: columnIndex,
                            row: rowIndex
                        },
                        span: {
                            cols: 1,
                            rows: 1
                        }
                    }
                },
                "border": {
                    bottom: {
                        colorKey: "colors/default",
                        style: "solid",
                        width: "1"
                    },
                    left: {
                        colorKey: "colors/default",
                        style: "solid",
                        width: "1"
                    },
                    right: {
                        colorKey: "colors/default",
                        style: "solid",
                        width: "1"
                    },
                    top: {
                        colorKey: "colors/default",
                        style: "solid",
                        width: "1"
                    }
                }
            }
        };

        return cell;
    }
}