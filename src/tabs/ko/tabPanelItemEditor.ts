
import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Objects from "@paperbits/common/objects";
import template from "./tabPanelItemEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { TabPanelItemModel } from "../tabPanelModel";
import {
    BackgroundStylePluginConfig,
    TypographyStylePluginConfig,
    MarginStylePluginConfig,
    SizeStylePluginConfig,
    BoxStylePluginConfig
} from "@paperbits/styles/plugins";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { EventManager } from "@paperbits/common/events/eventManager";
import { Events } from "@paperbits/common/events";
import { GridModel } from "../../grid-layout-section";

@Component({
    selector: "tabPanel-item-editor",
    template: template
})
export class TabPanelItemEditor {
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;
    public readonly tabLabel: ko.Observable<string>;

    private gridModel: GridModel;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.background = ko.observable<BackgroundStylePluginConfig>();
        this.sizeConfig = ko.observable<SizeStylePluginConfig>();
        this.tabLabel = ko.observable<string>();
    }

    @Param()
    public model: TabPanelItemModel;

    @Event()
    public onChange: (model: TabPanelItemModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.updateObservables();

        this.background
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.sizeConfig
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.tabLabel
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);

    }

    private updateObservables(): void {
        this.tabLabel(this.model.label);

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
        this.model.label = this.tabLabel();

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