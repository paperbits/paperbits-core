
import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Objects from "@paperbits/common/objects";
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
    BoxStylePluginConfig
} from "@paperbits/styles/contracts";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { EventManager } from "@paperbits/common/events/eventManager";
import { CommonEvents } from "@paperbits/common/events";


@Component({
    selector: "layout-section-editor",
    template: template
})
export class SectionEditor {
    public readonly stickTo: ko.Observable<string>;
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly stretch: ko.Observable<boolean>;

    public readonly minWidth: ko.Observable<string>;
    public readonly maxWidth: ko.Observable<string>;
    public readonly minHeight: ko.Observable<string>;
    public readonly maxHeight: ko.Observable<string>;

    public readonly elementStyleBox: ko.Observable<BoxStylePluginConfig>;
    private gridModel: GridModel;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.stickTo = ko.observable<string>("none");
        this.stretch = ko.observable<boolean>(false);
        this.background = ko.observable<BackgroundStylePluginConfig>();
        this.typography = ko.observable<TypographyStylePluginConfig>();
        this.minWidth = ko.observable<string>();
        this.maxWidth = ko.observable<string>();
        this.minHeight = ko.observable<string>();
        this.maxHeight = ko.observable<string>();
        this.elementStyleBox = ko.observable();
    }

    @Param()
    public model: SectionModel;

    @Event()
    public onChange: (model: SectionModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.updateObservables();
        this.stickTo.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.stretch.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.background.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.typography.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.minWidth.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.maxWidth.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.minHeight.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.maxHeight.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.elementStyleBox.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.eventManager.addEventListener(CommonEvents.onViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        if (this.model.styles) {
            if (this.model.styles.instance) {
                const sectionStyles = this.model.styles.instance;

                if (sectionStyles) {
                    this.background(sectionStyles.background);
                    this.typography(sectionStyles.typography);
                }
            }

            const stickToStyles = Objects.getObjectAt<string>(`instance/stickTo/${viewport}`, this.model.styles);

            if (stickToStyles) {
                this.stickTo(stickToStyles);
            }

            const stretchStyle = Objects.getObjectAt(`instance/size/${viewport}/stretch`, this.model.styles);
            this.stretch(!!stretchStyle);
        }

        this.gridModel = <GridModel>this.model.widgets[0];
        const gridStyles = this.gridModel.styles;
        const containerSizeStyles = Objects.getObjectAt<SizeStylePluginConfig>(`instance/size/${viewport}`, gridStyles);
        const marginStyles = Objects.getObjectAt<MarginStylePluginConfig>(`instance/margin/${viewport}`, gridStyles);

        this.elementStyleBox({ margin: marginStyles });

        if (containerSizeStyles) {
            this.minWidth(containerSizeStyles.minWidth);
            this.maxWidth(containerSizeStyles.maxWidth);
            this.minHeight(containerSizeStyles.minHeight);
            this.maxHeight(containerSizeStyles.maxHeight);
        }
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private applyChanges(): void {
        const viewport = this.viewManager.getViewport();
        this.model.styles = this.model.styles || {};

        if (this.model.styles.instance && !this.model.styles.instance.key) {
            this.model.styles.instance.key = Utils.randomClassName();
        }

        const gridStyles = this.gridModel.styles;

        const containerSizeStyles: SizeStylePluginConfig = {
            minWidth: this.minWidth(),
            maxWidth: this.maxWidth(),
            minHeight: this.minHeight(),
            maxHeight: this.maxHeight()
        };

        Objects.cleanupObject(containerSizeStyles);
        Objects.setValue(`instance/size/${viewport}`, gridStyles, containerSizeStyles);

        const marginStyle = this.elementStyleBox().margin;

        Objects.cleanupObject(marginStyle);
        Objects.setValue(`instance/margin/${viewport}`, gridStyles, marginStyle);
        Objects.setValue(`instance/stickTo/${viewport}`, this.model.styles, this.stickTo());
        Objects.setValue(`instance/size/${viewport}/stretch`, this.model.styles, this.stretch());

        this.onChange(this.model);
    }

    public onBackgroundUpdate(background: BackgroundStylePluginConfig): void {
        Objects.setValue("instance/background", this.model.styles, background);
        this.applyChanges();
    }

    public onTypographyUpdate(typography: TypographyStylePluginConfig): void {
        Objects.setValue("instance/typography", this.model.styles, typography);
        this.applyChanges();
    }

    public onBoxUpdate(pluginConfig: BoxStylePluginConfig): void {
        this.elementStyleBox(pluginConfig);
    }
}