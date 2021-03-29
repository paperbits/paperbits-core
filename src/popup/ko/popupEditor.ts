import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./popupEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { WidgetEditor } from "@paperbits/common/widgets";
import { StyleService, StyleHelper } from "@paperbits/styles";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { PopupModel } from "../popupModel";
import { BackgroundStylePluginConfig, TypographyStylePluginConfig, ContainerStylePluginConfig, SizeStylePluginConfig } from "@paperbits/styles/contracts";
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
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;
    public readonly containerSizeStyles: ko.Observable<SizeStylePluginConfig>;
    public readonly backdrop: ko.Observable<boolean>;
    public readonly position: ko.Observable<string>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly styleService: StyleService,
        private readonly eventManager: EventManager,
    ) {
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
        this.containerBackground = ko.observable<BackgroundStylePluginConfig>();
        this.backdropBackground = ko.observable<BackgroundStylePluginConfig>();

        this.containerSizeStyles = ko.observable<SizeStylePluginConfig>();
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

        const variations = await this.styleService.getComponentVariations("popup");

        this.appearanceStyles(variations.filter(x => x.category === "appearance"));
        this.updateObservables();

        this.appearanceStyle.subscribe(this.onAppearanceChange);
        this.eventManager.addEventListener("onViewportChange", this.updateObservables);

        this.position.subscribe(this.onPositionChange);
        this.backdrop.subscribe(this.onBackdropChange);
    }

    private updateObservables(): void {
        this.determinePosition();

        const containerStyleConfig = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "container");
        this.containerConfig(containerStyleConfig);

        const containerBackgroundStyleConfig = Objects.getObjectAt<BackgroundStylePluginConfig>("components/popupContainer/default/background", this.model.styles.instance);
        this.containerBackground(containerBackgroundStyleConfig);

        const backdropBackgroundStyleConfig = Objects.getObjectAt<BackgroundStylePluginConfig>("components/popupBackdrop/default/background", this.model.styles.instance);
        this.backdropBackground(backdropBackgroundStyleConfig);

        const containerSizeStyles = Objects.getObjectAt<SizeStylePluginConfig>("components/popupContainer/default/size", this.model.styles.instance);
        this.containerSizeStyles(containerSizeStyles);

        this.appearanceStyle(this.model.styles.appearance);
    }

    public onContainerContainerChange(pluginConfig: ContainerStylePluginConfig): void {
        Objects.setValue("components/popupContainer/default/container", this.model.styles.instance, pluginConfig);
        this.onChange(this.model);
    }

    public onContainerBackgroundChange(pluginConfig: BackgroundStylePluginConfig): void {
        Objects.setValue("components/popupContainer/default/background", this.model.styles.instance, pluginConfig);
        this.onChange(this.model);
    }

    public onBackdropBackgroundChange(pluginConfig: BackgroundStylePluginConfig): void {
        Objects.setValue("components/popupBackdrop/default/background", this.model.styles.instance, pluginConfig);
        this.onChange(this.model);
    }

    public onContainerSizeUpdate(containerSizeStyles: SizeStylePluginConfig): void {
        // containerSizeStyles.width = "100%";
        // containerSizeStyles.height = "100%";

        this.containerSizeStyles(containerSizeStyles);
        Objects.setValue("components/popupContainer/default/size", this.model.styles.instance, containerSizeStyles);
        this.onChange(this.model);
    }

    public onAppearanceChange(): void {
        const styleKey = this.appearanceStyle();
        Objects.setValue("styles/appearance", this.model, styleKey);

        this.onChange(this.model);
    }

    private onBackdropChange(backdrop: boolean): void {
        this.model.backdrop = backdrop;
        this.onChange(this.model);
    }

    private determinePosition(): void {
        const positionStyles = Objects.getObjectAt<PositionStylePluginConfig>("components/popupContainer/default/position", this.model.styles.instance);

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

        Objects.setValue("components/popupContainer/default/position", this.model.styles.instance, positionPluginConfig);
        Objects.setValue("components/popupContainer/default/transform", this.model.styles.instance, transform);

        this.onChange(this.model);

        // Temporary hack to reposition popup:
        const hostDocument = this.viewManager.getHostDocument();
        hostDocument.dispatchEvent(new CustomEvent("onPopupRepositionRequested"));
    }
}
