import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import * as Objects from "@paperbits/common/objects";
import template from "./gridCellEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { GridCellModel } from "../gridCellModel";
import { EventManager } from "@paperbits/common/events";
import { ContainerStylePluginConfig } from "@paperbits/styles/contracts";


@Component({
    selector: "grid-cell-editor",
    template: template,
    injectable: "gridCellEditor"
})
export class GridCellEditor {
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
        this.eventManager.addEventListener("onViewportChange", this.initialize.bind(this));
    }

    @Param()
    public model: GridCellModel;

    @Event()
    public onChange: (model: GridCellModel) => void;

    @OnMounted()
    public initialize(): void {
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

        this.containerConfig(containerConfig);
    }

    public onContainerUpdate(config: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        
        Objects.setValue(`styles/instance/grid-cell/${viewport}/alignment`, this.model, config.alignment);
        Objects.setValue(`styles/instance/grid-cell/${viewport}/overflow`, this.model, config.overflow);

        this.onChange(this.model);
    }
}
