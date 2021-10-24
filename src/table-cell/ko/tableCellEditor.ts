import * as ko from "knockout";
import template from "./tableCellEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { TableCellModel } from "../tableCellModel";
import { EventManager, Events } from "@paperbits/common/events";
import { ContainerStylePluginConfig, BoxStylePluginConfig } from "@paperbits/styles/plugins";
import { StyleHelper } from "@paperbits/styles";
import { GridCellStylePluginConfig } from "@paperbits/styles/plugins/grid/gridCellStylePluginConfig";
import { PaddingStylePluginConfig } from "@paperbits/styles/plugins/padding";


@Component({
    selector: "table-cell-editor",
    template: template
})
export class TableCellEditor {
    public readonly container: ko.Observable<ContainerStylePluginConfig>;
    public readonly box: ko.Observable<BoxStylePluginConfig>;

    constructor(private readonly eventManager: EventManager) {
        this.container = ko.observable<ContainerStylePluginConfig>();
        this.box = ko.observable<BoxStylePluginConfig>();
    }

    @Param()
    public model: TableCellModel;

    @Event()
    public onChange: (model: TableCellModel) => void;

    @OnMounted()
    public initialize(): void {
        this.updateObservables();
        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const tableCellStyleConfig = StyleHelper
            .style(this.model.styles)
            .plugin("grid-cell")
            .getConfig<GridCellStylePluginConfig>();

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


        this.box({ padding: paddingConfig });
    }

    public onContainerUpdate(containerConfig: ContainerStylePluginConfig): void {
        StyleHelper
            .style(this.model.styles)
            .plugin("grid-cell")
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
