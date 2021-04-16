import * as ko from "knockout";
import template from "./popupEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { WidgetEditor } from "@paperbits/common/widgets";
import { StyleHelper } from "@paperbits/styles";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { PopupModel } from "../popupModel";
import { BackgroundStylePluginConfig, TypographyStylePluginConfig, ContainerStylePluginConfig, SizeStylePluginConfig, BoxStylePluginConfig } from "@paperbits/styles/contracts";
import { EventManager } from "@paperbits/common/events";
import { PositionStylePluginConfig } from "@paperbits/styles/plugins/position";
import { TransformStylePluginConfig } from "@paperbits/styles/plugins/transform";


@Component({
    selector: "popup-editor",
    template: template
})
export class PopupEditor implements WidgetEditor<PopupModel> {
    public readonly containerBackground: ko.Observable<BackgroundStylePluginConfig>;
    public readonly backdropBackground: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;
    public readonly containerSizeStyles: ko.Observable<SizeStylePluginConfig>;
    public readonly containerSizeStylesResponsive: ko.Observable<boolean>;
    public readonly backdrop: ko.Observable<boolean>;
    public readonly position: ko.Observable<string>;
    public readonly containerBox: ko.Observable<BoxStylePluginConfig>;


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
    }

    @Param()
    public model: PopupModel;

    @Event()
    public onChange: (model: PopupModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.backdrop(this.model.backdrop);

        this.updateObservables();
        this.eventManager.addEventListener("onViewportChange", this.updateObservables);

        this.position.subscribe(this.onPositionChange);
        this.backdrop.subscribe(this.onBackdropChange);
    }

    private updateObservables(): void {
        this.determinePosition();

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

    public onPositionChange(position: string): void {
        let positionPluginConfig: PositionStylePluginConfig;
        let transform: TransformStylePluginConfig;

        switch (position) {
            case "attached":
                positionPluginConfig = {
                    position: "absolute"
                };
                transform = {
                    translate: { x: 0, y: 0 }
                };
                break;
            case "center":
                positionPluginConfig = {
                    position: "fixed",
                    top: "50%",
                    left: "50%"
                };
                transform = {
                    translate: { x: "-50%", y: "-50%" }
                };
                break;

            case "top":
                positionPluginConfig = {
                    position: "fixed",
                    top: 0,
                    left: "50%"
                };
                transform = {
                    translate: { x: "-50%" }
                };

                break;
            case "left":
                positionPluginConfig = {
                    position: "fixed",
                    top: "50%",
                    left: 0
                };
                transform = {
                    translate: { y: "-50%" }
                };
                break;

            case "right":
                positionPluginConfig = {
                    position: "fixed",
                    top: "50%",
                    right: 0
                };
                transform = {
                    translate: { y: "-50%" }
                };
                break;

            case "bottom":
                positionPluginConfig = {
                    position: "fixed",
                    left: "50%",
                    bottom: 0
                };
                transform = {
                    translate: { x: "-50%" }
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

        this.onChange(this.model);
    }
}
