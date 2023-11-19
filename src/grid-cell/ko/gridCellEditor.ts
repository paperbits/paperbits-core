import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import * as Objects from "@paperbits/common/objects";
import template from "./gridCellEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { GridCellModel } from "../gridCellModel";
import { EventManager, Events } from "@paperbits/common/events";
import { BackgroundStylePluginConfig, BorderRadiusStylePluginConfig, BorderStylePluginConfig, BoxStylePluginConfig, PaddingStylePluginConfig } from "@paperbits/styles/plugins";
import { ContainerStylePluginConfig } from "@paperbits/styles/plugins";
import { StyleHelper } from "@paperbits/styles";


@Component({
    selector: "grid-cell-editor",
    template: template
})
export class GridCellEditor {
    public readonly backgroundConfig: ko.Observable<BackgroundStylePluginConfig>;
    public readonly container: ko.Observable<ContainerStylePluginConfig>;
    public readonly box: ko.Observable<BoxStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.container = ko.observable<ContainerStylePluginConfig>();
        this.box = ko.observable<BoxStylePluginConfig>();
        this.backgroundConfig = ko.observable<BackgroundStylePluginConfig>();
    }

    @Param()
    public model: GridCellModel;

    @Event()
    public onChange: (model: GridCellModel) => void;

    @OnMounted()
    public initialize(): void {
        this.updateObservables();
        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const gridCellStyleConfig = <any>Objects.getObjectAt(`styles/instance/grid-cell`, this.model);

        if (!gridCellStyleConfig) {
            return;
        }

        const viewport = this.viewManager.getViewport();
        const breakpoint = Utils.getClosestBreakpoint(gridCellStyleConfig, viewport);
        const styleConfig = gridCellStyleConfig[breakpoint];

        const containerConfig: ContainerStylePluginConfig = {
            alignment: styleConfig.alignment,
            overflow: styleConfig.overflow
        };

        this.container(containerConfig);

        const paddingConfig = StyleHelper
            .style(this.model.styles)
            .plugin("padding")
            .getConfig<PaddingStylePluginConfig>(viewport);

        const borderConfig = StyleHelper
            .style(this.model.styles)
            .plugin("border")
            .getConfig<BorderStylePluginConfig>();

        const borderRadiusConfig = StyleHelper
            .style(this.model.styles)
            .plugin("borderRadius")
            .getConfig<BorderRadiusStylePluginConfig>();

        this.box({
            padding: paddingConfig,
            border: borderConfig,
            borderRadius: borderRadiusConfig
        });

        const backgroundStyleConfig = StyleHelper
            .style(this.model.styles)
            .plugin("background")
            .getConfig<BackgroundStylePluginConfig>();

        this.backgroundConfig(backgroundStyleConfig);
    }

    public onContainerUpdate(containerConfig: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();

        StyleHelper
            .style(this.model.styles)
            .plugin("grid-cell")
            .setConfig(containerConfig, viewport);

        this.onChange(this.model);
    }

    public onBoxUpdate(boxConfig: BoxStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();

        StyleHelper
            .style(this.model.styles)
            .plugin("padding")
            .setConfig(boxConfig.padding, viewport);

        StyleHelper
            .style(this.model.styles)
            .plugin("border")
            .setConfig(boxConfig.border);

        StyleHelper
            .style(this.model.styles)
            .plugin("borderRadius")
            .setConfig(boxConfig.borderRadius);

        this.onChange(this.model);
    }

    public onBackgroundChange(pluginConfig: BackgroundStylePluginConfig): void {
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "background", pluginConfig);
        this.onChange(this.model);
    }
}
