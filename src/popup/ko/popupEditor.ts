import * as ko from "knockout";
import template from "./popupEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { WidgetEditor } from "@paperbits/common/widgets";
import { StyleHelper } from "@paperbits/styles";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { PopupInstanceModel } from "../popupModel";
import { BackgroundStylePluginConfig, TypographyStylePluginConfig, ContainerStylePluginConfig, SizeStylePluginConfig, BoxStylePluginConfig, BorderStylePluginConfig, PaddingStylePluginConfig, BorderRadiusStylePluginConfig } from "@paperbits/styles/plugins";
import { EventManager, Events } from "@paperbits/common/events";
import { PositionStylePluginConfig } from "@paperbits/styles/plugins/position";
import { TransformStylePluginConfig } from "@paperbits/styles/plugins/transform";
import { SizeUnits, Size, CalcExpression } from "@paperbits/styles/size";


@Component({
    selector: "popup-editor",
    template: template
})
export class PopupEditor implements WidgetEditor<PopupInstanceModel> {
    public readonly containerBackground: ko.Observable<BackgroundStylePluginConfig>;
    public readonly backdropBackground: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;
    public readonly containerSizeStyles: ko.Observable<SizeStylePluginConfig>;
    public readonly containerSizeStylesResponsive: ko.Observable<boolean>;
    public readonly backdrop: ko.Observable<boolean>;
    public readonly position: ko.Observable<string>;
    public readonly containerBox: ko.Observable<BoxStylePluginConfig>;
    public readonly offsetX: ko.Observable<number>;
    public readonly offsetY: ko.Observable<number>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager,
    ) {
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
        this.containerBackground = ko.observable<BackgroundStylePluginConfig>();
        this.backdropBackground = ko.observable<BackgroundStylePluginConfig>();
        this.containerBox = ko.observable<BoxStylePluginConfig>();
        this.containerSizeStyles = ko.observable<SizeStylePluginConfig>();
        this.containerSizeStylesResponsive = ko.observable<boolean>();
        this.position = ko.observable();
        this.backdrop = ko.observable(true);
        this.offsetX = ko.observable(0);
        this.offsetY = ko.observable(0);
    }

    @Param()
    public model: PopupInstanceModel;

    @Event()
    public onChange: (model: PopupInstanceModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.backdrop(this.model.backdrop);

        this.updateObservables();
        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);

        this.position.subscribe(this.onPositionChange);
        this.offsetX.subscribe(this.onOffsetChange);
        this.offsetY.subscribe(this.onOffsetChange);
        this.backdrop.subscribe(this.onBackdropChange);
    }

    private updateObservables(): void {
        this.determinePosition();
        this.determineOffset();

        const popupContainerStyles = StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default");

        const containerStyleConfig = popupContainerStyles.plugin("container").getConfig<ContainerStylePluginConfig>();
        this.containerConfig(containerStyleConfig);

        const containerBackgroundStyleConfig = popupContainerStyles.plugin("background").getConfig<BackgroundStylePluginConfig>();
        this.containerBackground(containerBackgroundStyleConfig);

        const containerSizeStyles = popupContainerStyles.plugin("size").getConfig<SizeStylePluginConfig>();
        this.containerSizeStyles(containerSizeStyles);

        const backdropBackgroundStyleConfig = StyleHelper
            .style(this.model.styles)
            .component("popupBackdrop")
            .variation("default")
            .plugin("background")
            .getConfig<BackgroundStylePluginConfig>();

        this.backdropBackground(backdropBackgroundStyleConfig);

        const containerPaddingStyles = popupContainerStyles.plugin("padding").getConfig<PaddingStylePluginConfig>();
        const containerBorderStyles = popupContainerStyles.plugin("border").getConfig<BorderStylePluginConfig>();
        const containerBorderRadiusStyles = popupContainerStyles.plugin("borderRadius").getConfig<BorderRadiusStylePluginConfig>();

        const containerBox: BoxStylePluginConfig = {
            padding: containerPaddingStyles,
            border: containerBorderStyles,
            borderRadius: containerBorderRadiusStyles
        };

        this.containerBox(containerBox);
    }

    public onContainerContainerChange(pluginConfig: ContainerStylePluginConfig): void {
        StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("container")
            .setConfig(pluginConfig);

        this.onChange(this.model);
    }

    public onContainerBackgroundChange(pluginConfig: BackgroundStylePluginConfig): void {
        StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("background")
            .setConfig(pluginConfig);

        this.onChange(this.model);
    }

    public onBackdropBackgroundChange(pluginConfig: BackgroundStylePluginConfig): void {
        StyleHelper
            .style(this.model.styles)
            .component("popupBackdrop")
            .variation("default")
            .plugin("background")
            .setConfig(pluginConfig);

        this.onChange(this.model);
    }

    public onContainerSizeUpdate(containerSizeStyles: SizeStylePluginConfig): void {
        this.containerSizeStyles(containerSizeStyles);

        StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("size")
            .setConfig(containerSizeStyles);

        this.onChange(this.model);
    }

    private onBackdropChange(backdrop: boolean): void {
        this.model.backdrop = backdrop;
        this.onChange(this.model);
    }

    private determinePosition(): void {
        const positionStyles = StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("position")
            .getConfig<PositionStylePluginConfig>();

        if (positionStyles.position === "absolute") {
            this.position("attached");
            return;
        }

        if (positionStyles.left === 0) {
            this.position("left");
            return;
        }

        if (positionStyles.right === 0) {
            this.position("right");
            return;
        }

        if (positionStyles.top === 0) {
            this.position("top");
            return;
        }

        if (positionStyles.bottom === 0) {
            this.position("bottom");
            return;
        }

        this.position("center");
    }

    private determineOffset(): void {
        const transformPluginConfig = StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("transform")
            .getConfig<TransformStylePluginConfig>();

        let offsetX = new Size(0);
        let offsetY = new Size(0);

        if (CalcExpression.isExpr(transformPluginConfig.translate.x)) {
            const parsed = CalcExpression.parse(transformPluginConfig.translate.x);

            if (parsed && parsed.members.length > 1) {
                offsetX = parsed.members[1]; // second expression member is offsetX
            }
        }

        if (CalcExpression.isExpr(transformPluginConfig.translate.y)) {
            const result = CalcExpression.parse(transformPluginConfig.translate.y);

            if (result && result.members.length > 1) {
                offsetY = result.members[1]; // second expression member is offsetY
            }
        }

        if (this.position() === "right") {
            offsetX.value = -offsetX.value;
        }

        if (this.position() === "bottom") {
            offsetY.value = -offsetY.value;
        }

        this.offsetX(offsetX.value);
        this.offsetY(offsetY.value);

        this.recalculateStyles();
    }

    private onOffsetChange(): void {
        this.recalculateStyles();
    }

    private recalculateStyles(): void {
        const position = this.position();
        const offsetXString = this.offsetX();
        const offsetYString = this.offsetY();

        let positionPluginConfig: PositionStylePluginConfig;
        let transform: TransformStylePluginConfig;

        const offsetX = new Size(offsetXString || 0);
        const offsetY = new Size(offsetYString || 0);

        switch (position) {
            case "attached":
                positionPluginConfig = {
                    position: "absolute"
                };
                transform = {
                    translate: {
                        // x: offsetX.toString(),
                        // y: offsetY.toString()
                        x: StyleHelper.calculate(new Size(0, SizeUnits.pixels), offsetX),
                        y: StyleHelper.calculate(new Size(0, SizeUnits.pixels), offsetY),
                    }
                };
                break;

            case "center":
                positionPluginConfig = {
                    position: "fixed",
                    top: "50%",
                    left: "50%"
                };
                transform = {
                    translate: {
                        x: StyleHelper.calculate(new Size(-50, SizeUnits.percents), offsetX),
                        y: StyleHelper.calculate(new Size(-50, SizeUnits.percents), offsetY),
                    }
                };
                break;

            case "top":
                positionPluginConfig = {
                    position: "fixed",
                    top: 0,
                    left: "50%"
                };
                transform = {
                    translate: {
                        x: StyleHelper.calculate(new Size(-50, SizeUnits.percents), offsetX),
                        y: offsetY.toString(),
                    }
                };
                break;

            case "left":
                positionPluginConfig = {
                    position: "fixed",
                    top: "50%",
                    left: 0
                };
                transform = {
                    translate: {
                        x: offsetX.toString(),
                        y: StyleHelper.calculate(new Size(-50, SizeUnits.percents), offsetY),
                    }
                };
                break;

            case "right":
                offsetX.value = -offsetX.value;

                positionPluginConfig = {
                    position: "fixed",
                    top: "50%",
                    right: 0
                };
                transform = {
                    translate: {
                        x: offsetX.toString(),
                        y: StyleHelper.calculate(new Size(-50, SizeUnits.percents), offsetY),
                    }
                };
                break;

            case "bottom":
                offsetY.value = -offsetY.value;

                positionPluginConfig = {
                    position: "fixed",
                    left: "50%",
                    bottom: 0
                };
                transform = {
                    translate: {
                        x: StyleHelper.calculate(new Size(-50, SizeUnits.percents), offsetX),
                        y: offsetY.toString()
                    }
                };
                break;
        }

        StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("position")
            .setConfig(positionPluginConfig);

        StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("transform")
            .setConfig(transform);

        this.onChange(this.model);

        setTimeout(() => {    // Temporary hack to reposition popup:
            const hostDocument = this.viewManager.getHostDocument();
            hostDocument.dispatchEvent(new CustomEvent("onPopupRepositionRequested"));
        }, 10);
    }

    public onPositionChange(position: string): void {
        this.position(position);
        this.recalculateStyles();
    }

    public onBoxUpdate(pluginConfig: BoxStylePluginConfig): void {
        this.containerBox(pluginConfig);

        StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("padding")
            .setConfig(pluginConfig.padding);

        StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("border")
            .setConfig(pluginConfig.border);

        StyleHelper
            .style(this.model.styles)
            .component("popupContainer")
            .variation("default")
            .plugin("borderRadius")
            .setConfig(pluginConfig.borderRadius);

        this.onChange(this.model);
    }
}
