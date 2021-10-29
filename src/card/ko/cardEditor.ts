import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./cardEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { WidgetEditor } from "@paperbits/common/widgets";
import { StyleService, StyleHelper } from "@paperbits/styles";
import { ContainerStylePluginConfig } from "@paperbits/styles/plugins";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { CardModel } from "../cardModel";
import { BackgroundStylePluginConfig, TypographyStylePluginConfig } from "@paperbits/styles/plugins";
import { EventManager, Events } from "@paperbits/common/events";



@Component({
    selector: "card-editor",
    template: template
})
export class CardEditor implements WidgetEditor<CardModel> {
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly styleService: StyleService,
        private readonly eventManager: EventManager
    ) {
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
        this.background = ko.observable<BackgroundStylePluginConfig>();
    }

    @Param()
    public model: CardModel;

    @Event()
    public onChange: (model: CardModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const variations = await this.styleService.getComponentVariations("card");

        this.appearanceStyles(variations.filter(x => x.category === "appearance"));
        this.updateObservables();

        this.appearanceStyle.subscribe(this.onAppearanceChange);
        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        const containerStyleConfig = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "container", viewport);
        this.containerConfig(containerStyleConfig);

        const backgroundStyleConfig = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "background", viewport);
        this.background(backgroundStyleConfig);

        this.appearanceStyle(this.model.styles.appearance);
    }

    public onContainerChange(pluginConfig: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "container", pluginConfig, viewport);

        this.onChange(this.model);
    }

    public onBackgroundChange(pluginConfig: BackgroundStylePluginConfig): void {
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "background", pluginConfig);
        this.onChange(this.model);
    }

    public onAppearanceChange(): void {
        const styleKey = this.appearanceStyle();
        Objects.setValue("styles/appearance", this.model, styleKey);

        this.onChange(this.model);
    }
}
