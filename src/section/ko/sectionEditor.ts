
import * as ko from "knockout";
import template from "./sectionEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { SectionModel } from "../sectionModel";
import { GridModel } from "../../grid-layout-section";
import {
    BackgroundStylePluginConfig,
    TypographyStylePluginConfig,
    MarginStylePluginConfig,
    SizeStylePluginConfig,
    BoxStylePluginConfig,
    BorderStylePluginConfig,
    BorderRadiusStylePluginConfig
} from "@paperbits/styles/plugins";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { EventManager } from "@paperbits/common/events/eventManager";
import { Events } from "@paperbits/common/events";
import { StyleHelper } from "@paperbits/styles";

@Component({
    selector: "layout-section-editor",
    template: template
})
export class SectionEditor {
    public readonly stickTo: ko.Observable<string>;
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly containerBox: ko.Observable<BoxStylePluginConfig>;
    public readonly sectionBox: ko.Observable<BoxStylePluginConfig>;
    public readonly containerSizeStyles: ko.Observable<SizeStylePluginConfig>;
    public readonly sectionSizeStyles: ko.Observable<SizeStylePluginConfig>;
    private gridModel: GridModel;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.stickTo = ko.observable<string>("none");
        this.background = ko.observable<BackgroundStylePluginConfig>();
        this.typography = ko.observable<TypographyStylePluginConfig>();
        this.containerSizeStyles = ko.observable<SizeStylePluginConfig>();
        this.sectionSizeStyles = ko.observable<SizeStylePluginConfig>();
        this.sectionBox = ko.observable<BoxStylePluginConfig>();
        this.containerBox = ko.observable<BoxStylePluginConfig>();
    }

    @Param()
    public model: SectionModel;

    @Event()
    public onChange: (model: SectionModel) => void;

    @OnMounted()
    public initialize(): void {
        this.updateObservables();

        this.stickTo
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        /* Section styles */
        const localStyles = this.model.styles;


        const sectionStyles = StyleHelper
            .style(this.model.styles);

        const typographyStyles = <TypographyStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(localStyles, "typography");
        this.typography(typographyStyles);

        const backgroundStyles = <BackgroundStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(localStyles, "background");
        this.background(backgroundStyles);

        const stickToStyles = <string>StyleHelper.getPluginConfigForLocalStyles(localStyles, "stickTo", viewport);
        this.stickTo(stickToStyles || "none");

        const sectionSizeStyles = <SizeStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(localStyles, "size", viewport);
        this.sectionSizeStyles(sectionSizeStyles);

        /* Grid styles */
        this.gridModel = <GridModel>this.model.widgets[0];
        const gridLocalStyles = this.gridModel.styles;

        

        const containerSizeStyles = gridLocalStyles.instance.size;
        const marginStyles = <MarginStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(gridLocalStyles, "margin", viewport);
        const paddingStyles = <MarginStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(gridLocalStyles, "padding", viewport);

        this.containerBox({ margin: marginStyles, padding: paddingStyles });
        this.containerSizeStyles(containerSizeStyles);

        const borderStyles = sectionStyles.plugin("border").getConfig<BorderStylePluginConfig>();
        const borderRadiusStyles = sectionStyles.plugin("borderRadius").getConfig<BorderRadiusStylePluginConfig>();

        const sectionBoxStyles: BoxStylePluginConfig = {
            border: borderStyles,
            borderRadius: borderRadiusStyles
        };

        this.sectionBox(sectionBoxStyles);
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private applyChanges(): void {
        const viewport = this.viewManager.getViewport();

        /* Section styles */
        const sectionStyles = this.model.styles;
        StyleHelper.setPluginConfigForLocalStyles(sectionStyles, "stickTo", this.stickTo(), viewport);
        StyleHelper.setPluginConfigForLocalStyles(sectionStyles, "size", this.sectionSizeStyles(), viewport);
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "stickTo", this.stickTo(), viewport);

        /* Grid styles */
        const gridStyles = this.gridModel.styles;
        const marginStyle = this.containerBox().margin;
        const paddingStyle = this.containerBox().padding;
        const containerSizeStyles: SizeStylePluginConfig = this.containerSizeStyles();

        StyleHelper.setPluginConfigForLocalStyles(gridStyles, "size", containerSizeStyles);
        StyleHelper.setPluginConfigForLocalStyles(gridStyles, "margin", marginStyle, viewport);
        StyleHelper.setPluginConfigForLocalStyles(gridStyles, "padding", paddingStyle, viewport);

        this.onChange(this.model);
    }

    public onBackgroundUpdate(backgroundStyles: BackgroundStylePluginConfig): void {
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "background", backgroundStyles);
        this.applyChanges();
    }

    public onTypographyUpdate(typographyStyles: TypographyStylePluginConfig): void {
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "typography", typographyStyles);
        this.applyChanges();
    }

    public onSectionBoxUpdate(pluginConfig: BoxStylePluginConfig): void {
        this.sectionBox(pluginConfig);

        StyleHelper
            .style(this.model.styles)
            .plugin("border")
            .setConfig(pluginConfig.border);

        StyleHelper
            .style(this.model.styles)
            .plugin("borderRadius")
            .setConfig(pluginConfig.borderRadius);

        this.onChange(this.model);
    }

    public onContainerBoxUpdate(pluginConfig: BoxStylePluginConfig): void {
        this.containerBox(pluginConfig);
        this.applyChanges();
    }

    public onContainerSizeUpdate(containerSizeStyles: SizeStylePluginConfig): void {
        this.containerSizeStyles(containerSizeStyles);
        this.applyChanges();
    }

    public onSectionSizeUpdate(containerSizeStyles: SizeStylePluginConfig): void {
        this.sectionSizeStyles(containerSizeStyles);
        this.applyChanges();
    }
}