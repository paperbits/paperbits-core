import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./tableColumnEditor.html";
import { StyleHelper, StyleService } from "@paperbits/styles";
import { SizeUnits, Size } from "@paperbits/styles/size";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TableModel } from "../tableModel";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { BoxStylePluginConfig } from "@paperbits/styles/plugins";
import { StylePluginConfig } from "@paperbits/common/styles";


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
        const width = Size.parse(this.model.styles.instance.grid.xs.cols[this.columnIndex]);

        if (width?.units === SizeUnits.pixels) {
            this.width(width.value);
        }

        this.width
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);
    }

    private applyColumnStyles(pluginName: string, config: StylePluginConfig): void {
        for (let rowIndex = 0; rowIndex < this.model.numOfRows; rowIndex++) {
            const cellIndex = (rowIndex * this.model.numOfCols) + this.columnIndex;
            const cellModel = this.model.widgets[cellIndex];

            const currentConfig = StyleHelper
                .style(cellModel.styles)
                .plugin(pluginName)
                .getConfig() || {};

            Objects.mergeDeep(currentConfig, config);

            StyleHelper
                .style(cellModel.styles)
                .plugin(pluginName)
                .setConfig(currentConfig);
        }
    }

    public onBoxUpdate(newConfig: BoxStylePluginConfig, changeset: BoxStylePluginConfig): void {
        this.applyColumnStyles("border", changeset.border);
        this.applyColumnStyles("padding", changeset.padding);

        this.onChange(this.model);
    }

    private applyChanges(): void {
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