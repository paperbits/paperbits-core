
import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import template from "./carouselItemEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { CarouselItemModel } from "../carouselModel";
import {
    BackgroundStylePluginConfig,
    BoxStylePluginConfig,
    MarginStylePluginConfig,
    SizeStylePluginConfig
} from "@paperbits/styles/plugins";
import { EventManager } from "@paperbits/common/events/eventManager";
import { Events } from "@paperbits/common/events";
import { GridModel } from "../../grid-layout-section";
import { StyleHelper } from "@paperbits/styles";

@Component({
    selector: "carousel-item-editor",
    template: template
})
export class CarouselItemEditor {
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly containerSizeStyles: ko.Observable<SizeStylePluginConfig>;
    public readonly box: ko.Observable<BoxStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.background = ko.observable<BackgroundStylePluginConfig>();
        this.containerSizeStyles = ko.observable<SizeStylePluginConfig>();
        this.box = ko.observable<BoxStylePluginConfig>();
    }

    @Param()
    public model: CarouselItemModel;

    @Event()
    public onChange: (model: CarouselItemModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.updateObservables();
        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        /* Slide styles */
        const localStyles = this.model.styles;

        const backgroundStyles = <BackgroundStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(localStyles, "background");
        this.background(backgroundStyles);

        /* Grid styles */
        const gridModel = <GridModel>this.model.widgets[0];

        if (gridModel) {
            const gridLocalStyles = gridModel.styles;
            const containerSizeStyles = <SizeStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(gridLocalStyles, "size", viewport);
            const marginStyles = <MarginStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(gridLocalStyles, "margin", viewport);

            this.box({ margin: marginStyles });
            this.containerSizeStyles(containerSizeStyles);
        }
    }

    private applyChanges(): void {
        const viewport = this.viewManager.getViewport();
        this.model.styles = this.model.styles || {};

        if (this.model.styles.instance && !this.model.styles.instance.key) {
            this.model.styles.instance.key = Utils.randomClassName();
        }

        const gridModel = <GridModel>this.model.widgets[0];

        if (gridModel) {
            const gridLocalStyles = gridModel.styles;
            const marginStyle = this.box().margin;
            const containerSizeStyles: SizeStylePluginConfig = this.containerSizeStyles();
            StyleHelper.setPluginConfigForLocalStyles(gridLocalStyles, "size", containerSizeStyles, viewport);
            StyleHelper.setPluginConfigForLocalStyles(gridLocalStyles, "margin", marginStyle, viewport);
        }

        this.onChange(this.model);
    }

    public onBackgroundUpdate(backgroundStyles: BackgroundStylePluginConfig): void {
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "background", backgroundStyles);
        this.applyChanges();
    }

    public onBoxUpdate(pluginConfig: BoxStylePluginConfig): void {
        this.box(pluginConfig);
        this.applyChanges();
    }

    public onContainerSizeUpdate(containerSizeStyles: SizeStylePluginConfig): void {
        this.containerSizeStyles(containerSizeStyles);
        this.applyChanges();
    }
}