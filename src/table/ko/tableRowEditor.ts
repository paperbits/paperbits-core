import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./tableRowEditor.html";
import { StyleHelper, StyleService } from "@paperbits/styles";
import { SizeUnits, Size } from "@paperbits/styles/size";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TableModel } from "../tableModel";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { StylePluginConfig } from "@paperbits/common/styles";
import { BoxStylePluginConfig } from "@paperbits/styles/plugins";


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
        const height = Size.parse(this.model.styles.instance.grid.xs.rows[this.rowIndex]);

        if (height?.units === SizeUnits.pixels) {
            this.height(height.value);
        }

        this.height
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);
    }

    private applyRowStyles(pluginName: string, config: StylePluginConfig): void {
        for (let columnIndex = 0; columnIndex < this.model.numOfCols; columnIndex++) {
            const cellIndex = (this.rowIndex * this.model.numOfCols) + columnIndex;
            const cellModel = this.model.widgets[cellIndex];

            const currentConfig = StyleHelper
                .style(cellModel.styles)
                .plugin(pluginName)
                .getConfig() || {};

            Objects.cleanupObject(config);
            Objects.mergeDeep(currentConfig, config);

            StyleHelper
                .style(cellModel.styles)
                .plugin(pluginName)
                .setConfig(currentConfig);
        }
    }

    public onBoxUpdate(config: BoxStylePluginConfig): void {
        this.applyRowStyles("border", config.border);
        this.applyRowStyles("padding", config.padding);

        this.onChange(this.model);
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