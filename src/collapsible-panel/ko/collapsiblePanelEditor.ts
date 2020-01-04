import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import * as Objects from "@paperbits/common/objects";
import template from "./collapsiblePanelEditor.html";
import { CollapsiblePanelModel } from "../collapsiblePanelModel";
import { Component, OnMounted, Param, Event, OnDestroyed } from "@paperbits/common/ko/decorators";
import { ContainerStylePluginConfig, BackgroundStylePluginConfig } from "@paperbits/styles/contracts";
import { ViewManager } from "@paperbits/common/ui";
import { EventManager, CommonEvents } from "@paperbits/common/events";

@Component({
    selector: "collapsible-panel-editor",
    template: template
})
export class CollapsiblePanelEditor {
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;
    public readonly backgroundConfig: ko.Observable<BackgroundStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.backgroundConfig = ko.observable<BackgroundStylePluginConfig>();
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
    }

    @Param()
    public model: CollapsiblePanelModel;

    @Event()
    public onChange: (model: CollapsiblePanelModel) => void;

    @OnMounted()
    public initialize(): void {
        const viewport = this.viewManager.getViewport();

        const localStyle = this.model.styles?.instance;

        if (!localStyle) {
            Objects.setValue(`styles/instance/key`, this.model, Utils.randomClassName());
        }

        const containerConfig = <any>Objects.getObjectAt(`styles/instance/container/${viewport}`, this.model);
        this.containerConfig(containerConfig);

        const backgroundConfig = Objects.getObjectAt(`instance/background/${viewport}`, this.model.styles);
        this.backgroundConfig(backgroundConfig);

        this.eventManager.addEventListener(CommonEvents.onViewportChange, this.initialize);
    }

    public onContainerUpdate(config: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        Objects.setValue(`styles/instance/container/${viewport}`, this.model, config);
        this.onChange(this.model);
        this.containerConfig(config);
    }

    public onBackgroundUpdate(config: BackgroundStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        Objects.setValue(`styles/instance/background/${viewport}`, this.model, config);
        this.onChange(this.model);
        this.backgroundConfig(config);
    }

    @OnDestroyed()
    public dispose(): void {
        this.eventManager.removeEventListener(CommonEvents.onViewportChange, this.initialize);
    }
}