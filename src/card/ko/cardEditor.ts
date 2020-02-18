import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import * as Utils from "@paperbits/common/utils";
import template from "./cardEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { WidgetEditor } from "@paperbits/common/widgets";
import { StyleService } from "@paperbits/styles";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { CardModel } from "../cardModel";
import { BackgroundStylePluginConfig, TypographyStylePluginConfig, ContainerStylePluginConfig } from "@paperbits/styles/contracts";
import { EventManager } from "@paperbits/common/events";


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
        this.eventManager.addEventListener("onViewportChange", this.updateObservables);
    }

    private updateObservables(): void {
        if (!this.model.styles) {
            return;
        }

        const containerStyleConfig = <any>Objects.getObjectAt(`styles/instance/container`, this.model);

        if (containerStyleConfig) {
            const viewport = this.viewManager.getViewport();
            const breakpoint = Utils.getClosestBreakpoint(containerStyleConfig, viewport);
            const styleConfig = containerStyleConfig[breakpoint];

            if (styleConfig) {
                const containerConfig: ContainerStylePluginConfig = {
                    alignment: styleConfig.alignment,
                    overflow: styleConfig.overflow
                };

                this.containerConfig(containerConfig);

                this.background(styleConfig.background);
            }
        }

        this.appearanceStyle(this.model.styles.appearance);
    }

    public onContainerChange(config: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        Objects.setValue(`instance/container/${viewport}/alignment`, this.model.styles, config.alignment);
        Objects.setValue(`instance/container/${viewport}/overflow`, this.model.styles, config.overflow);

        this.onChange(this.model);
    }

    public onBackgroundUpdate(background: BackgroundStylePluginConfig): void {
        Objects.setValue("instance/background", this.model.styles, background);
        this.onChange(this.model);
    }

    public onAppearanceChange(): void {
        Objects.setValue("styles/appearance", this.model, this.appearanceStyle());

        this.onChange(this.model);
    }
}
