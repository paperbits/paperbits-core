import * as ko from "knockout";
import template from "./tableCellEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TableCellModel } from "../tableCellModel";
import { ContainerStylePluginConfig, BoxStylePluginConfig, BorderStylePluginConfig } from "@paperbits/styles/plugins";
import { StyleHelper } from "@paperbits/styles";
import { TableCellStylePluginConfig } from "@paperbits/styles/plugins/table/tableCellStylePluginConfig";
import { PaddingStylePluginConfig } from "@paperbits/styles/plugins/padding";


@Component({
    selector: "table-cell-editor",
    template: template
})
export class TableCellEditor {
    public readonly container: ko.Observable<ContainerStylePluginConfig>;
    public readonly box: ko.Observable<BoxStylePluginConfig>;

    constructor() {
        this.container = ko.observable<ContainerStylePluginConfig>();
        this.box = ko.observable<BoxStylePluginConfig>();
    }

    @Param()
    public model: TableCellModel;

    @Event()
    public onChange: (model: TableCellModel) => void;

    @OnMounted()
    public initialize(): void {
        const tableCellStyleConfig = StyleHelper
            .style(this.model.styles)
            .plugin("table-cell")
            .getConfig<TableCellStylePluginConfig>();

        if (!tableCellStyleConfig) {
            return;
        }

        const containerConfig: ContainerStylePluginConfig = {
            alignment: tableCellStyleConfig.alignment,
            overflow: tableCellStyleConfig.overflow
        };

        this.container(containerConfig);

        const paddingConfig = StyleHelper
            .style(this.model.styles)
            .plugin("padding")
            .getConfig<PaddingStylePluginConfig>();

        const borderConfig = StyleHelper
            .style(this.model.styles)
            .plugin("border")
            .getConfig<BorderStylePluginConfig>();

        this.box({ padding: paddingConfig, border: borderConfig });
    }

    public onContainerUpdate(containerConfig: ContainerStylePluginConfig): void {
        StyleHelper
            .style(this.model.styles)
            .plugin("table-cell")
            .setConfig(containerConfig);

        this.onChange(this.model);
    }

    public onBoxUpdate(boxConfig: BoxStylePluginConfig): void {
        StyleHelper
            .style(this.model.styles)
            .plugin("border")
            .setConfig(boxConfig.border);

        StyleHelper
            .style(this.model.styles)
            .plugin("padding")
            .setConfig(boxConfig.padding);

        this.onChange(this.model);
    }
}
