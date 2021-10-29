import * as ko from "knockout";
import template from "./collapsiblePanelEditor.html";
import { CollapsiblePanelModel } from "../collapsiblePanelModel";
import { Component, OnMounted, Param, Event, OnDestroyed } from "@paperbits/common/ko/decorators";
import { BackgroundStylePluginConfig, SizeStylePluginConfig } from "@paperbits/styles/plugins";
import { ContainerStylePluginConfig } from "@paperbits/styles/plugins";
import { ViewManager } from "@paperbits/common/ui";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleHelper } from "@paperbits/styles";

@Component({
    selector: "collapsible-panel-editor",
    template: template
})
export class CollapsiblePanelEditor {
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;
    public readonly backgroundConfig: ko.Observable<BackgroundStylePluginConfig>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.backgroundConfig = ko.observable<BackgroundStylePluginConfig>();
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
        this.sizeConfig = ko.observable<SizeStylePluginConfig>();
    }

    @Param()
    public model: CollapsiblePanelModel;

    @Event()
    public onChange: (model: CollapsiblePanelModel) => void;

    @OnMounted()
    public initialize(): void {
        this.updateObservables();
        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        const containerStyleConfig = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "container", viewport);
        this.containerConfig(containerStyleConfig);

        const backgroundStyleConfig = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "background", viewport);
        this.backgroundConfig(backgroundStyleConfig);

        const sizeStyleConfig = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "size", viewport);
        this.sizeConfig(sizeStyleConfig);
    }

    public onContainerChange(pluginConfig: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "container", pluginConfig, viewport);

        this.onChange(this.model);
    }

    public onBackgroundChange(pluginConfig: BackgroundStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "background", pluginConfig, viewport);

        this.onChange(this.model);
    }

    public onSizeChange(pluginConfig: SizeStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "size", pluginConfig, viewport);

        this.onChange(this.model);
    }

    @OnDestroyed()
    public dispose(): void {
        this.eventManager.removeEventListener(Events.ViewportChange, this.initialize);
    }
}