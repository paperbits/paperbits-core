
import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Objects from "@paperbits/common/objects";
import template from "./carouselItemEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { CarouselItemModel } from "../carouselModel";
import {
    BackgroundStylePluginConfig,
    TypographyStylePluginConfig,
    MarginStylePluginConfig,
    SizeStylePluginConfig,
    BoxStylePluginConfig
} from "@paperbits/styles/contracts";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { EventManager } from "@paperbits/common/events/eventManager";
import { CommonEvents } from "@paperbits/common/events";
import { GridModel } from "../../grid-layout-section";

@Component({
    selector: "carousel-item-editor",
    template: template
})
export class CarouselItemEditor {
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;

    private gridModel: GridModel;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.background = ko.observable<BackgroundStylePluginConfig>();
        this.sizeConfig = ko.observable<SizeStylePluginConfig>();
    }

    @Param()
    public model: CarouselItemModel;

    @Event()
    public onChange: (model: CarouselItemModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.updateObservables();
        this.background.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.sizeConfig.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.eventManager.addEventListener(CommonEvents.onViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();
        const sectionStyles = this.model?.styles?.instance;

        if (sectionStyles) {
            this.background(sectionStyles.background);
        }

        this.gridModel = <GridModel>this.model.widgets[0];
        const gridStyles = this.gridModel?.styles;

        if (gridStyles) {
            const containerSizeStyles = Objects.getObjectAt<SizeStylePluginConfig>(`instance/size/${viewport}`, gridStyles);
            this.sizeConfig(containerSizeStyles);
        }
    }

    private applyChanges(): void {
        const viewport = this.viewManager.getViewport();
        this.model.styles = this.model.styles || {};

        if (this.model.styles.instance && !this.model.styles.instance.key) {
            this.model.styles.instance.key = Utils.randomClassName();
        }

        const gridStyles = this.gridModel?.styles;

        if (gridStyles) {
            const containerSizeStyles: SizeStylePluginConfig = this.sizeConfig();
            Objects.setValue(`instance/size/${viewport}`, gridStyles, containerSizeStyles);
        }

        this.onChange(this.model);
    }

    public onBackgroundUpdate(background: BackgroundStylePluginConfig): void {
        Objects.setValue("instance/background", this.model.styles, background);
        this.applyChanges();
    }

    public onSizeUpdate(sizeConfig: SizeStylePluginConfig): void {
        this.sizeConfig(sizeConfig);
    }
}