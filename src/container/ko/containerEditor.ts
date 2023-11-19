import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./containerEditor.html";
import { WidgetEditor } from "@paperbits/common/widgets";
import { StyleService, StyleHelper } from "@paperbits/styles";
import { BackgroundStylePluginConfig, TypographyStylePluginConfig } from "@paperbits/styles/plugins";
import { BorderRadiusStylePluginConfig, BorderStylePluginConfig, BoxStylePluginConfig, ContainerStylePluginConfig, PaddingStylePluginConfig, PositionStylePluginConfig, SizeStylePluginConfig } from "@paperbits/styles/plugins";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { ContainerModel } from "../containerModel";



@Component({
    selector: "container-editor",
    template: template
})
export class ContainerEditor implements WidgetEditor<ContainerModel> {
    public readonly backgroundConfig: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;
    public readonly boxConfig: ko.Observable<BoxStylePluginConfig>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;

    constructor(private readonly styleService: StyleService) {
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
        this.backgroundConfig = ko.observable<BackgroundStylePluginConfig>();
        this.boxConfig = ko.observable<BoxStylePluginConfig>();
        this.sizeConfig = ko.observable<SizeStylePluginConfig>();
    }

    @Param()
    public model: ContainerModel;

    @Event()
    public onChange: (model: ContainerModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const variations = await this.styleService.getComponentVariations("container");

        this.appearanceStyles(variations.filter(x => x.category === "appearance"));
        this.updateObservables();

        this.appearanceStyle.subscribe(this.onAppearanceChange);
    }

    private updateObservables(): void {
        const containerStyleConfig = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "container");
        this.containerConfig(containerStyleConfig);

        const backgroundStyleConfig = StyleHelper
            .style(this.model.styles)
            .plugin("background")
            .getConfig<BackgroundStylePluginConfig>();

        this.backgroundConfig(backgroundStyleConfig);

        const paddingConfig = StyleHelper
            .style(this.model.styles)
            .plugin("padding")
            .getConfig<PaddingStylePluginConfig>();

        const borderConfig = StyleHelper
            .style(this.model.styles)
            .plugin("border")
            .getConfig<BorderStylePluginConfig>();

        const borderRadiusConfig = StyleHelper
            .style(this.model.styles)
            .plugin("borderRadius")
            .getConfig<BorderRadiusStylePluginConfig>();

        this.boxConfig({
            padding: paddingConfig,
            border: borderConfig,
            borderRadius: borderRadiusConfig
        });

        const sizeConfig = StyleHelper
            .style(this.model.styles)
            .plugin("size")
            .getConfig<SizeStylePluginConfig>();

        this.sizeConfig(sizeConfig);

        this.appearanceStyle(this.model.styles.appearance);
    }

    public onContainerChange(pluginConfig: ContainerStylePluginConfig): void {
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "container", pluginConfig);

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

    public onBoxUpdate(boxConfig: BoxStylePluginConfig): void {
        StyleHelper
            .style(this.model.styles)
            .plugin("padding")
            .setConfig(boxConfig.padding);

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

    public onSizeChange(sizeConfig: SizeStylePluginConfig): void {
        this.sizeConfig(sizeConfig);

        StyleHelper
            .style(this.model.styles)
            .plugin("size")
            .setConfig(sizeConfig);

        this.onChange(this.model);
    }
}
