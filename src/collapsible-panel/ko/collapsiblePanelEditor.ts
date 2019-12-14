import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import * as Objects from "@paperbits/common/objects";
import template from "./collapsiblePanelEditor.html";
import { CollapsiblePanelModel } from "../collapsiblePanelModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { ContainerStylePluginConfig } from "@paperbits/styles/contracts";
import { ViewManager } from "@paperbits/common/ui";
import { EventManager } from "@paperbits/common/events";

@Component({
    selector: "collapsible-panel-editor",
    template: template,
    injectable: "collapsiblePanelEditor"
})
export class CollapsiblePanelEditor {
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
        this.eventManager.addEventListener("onViewportChange", this.initialize.bind(this));
    }

    @Param()
    public model: CollapsiblePanelModel;

    @Event()
    public onChange: (model: CollapsiblePanelModel) => void;

    @OnMounted()
    public initialize(): void {
        const gridCellStyleConfig = <any>Objects.getObjectAt(`styles/instance/container`, this.model);

        if (!gridCellStyleConfig) {
            return;
        }

        const viewport = this.viewManager.getViewport();
        const breakpoint = Utils.getClosestBreakpoint(gridCellStyleConfig, viewport);
        const styleConfig = gridCellStyleConfig[breakpoint];

        if (styleConfig) {
            const containerConfig: ContainerStylePluginConfig = {
                alignment: styleConfig.alignment,
                overflow: styleConfig.overflow
            };

            this.containerConfig(containerConfig);
        }
    }

    public onContainerUpdate(config: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();

        Objects.setValue(`styles/instance/container/${viewport}/alignment`, this.model, config.alignment);
        Objects.setValue(`styles/instance/container/${viewport}/overflow`, this.model, config.overflow);

        this.onChange(this.model);
    }
}