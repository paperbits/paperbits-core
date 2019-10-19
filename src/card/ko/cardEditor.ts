import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import * as Utils from "@paperbits/common/utils";
import template from "./cardEditor.html";
import { IViewManager } from "@paperbits/common/ui";
import { WidgetEditor } from "@paperbits/common/widgets";
import { StyleService } from "@paperbits/styles";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { CardModel } from "../cardModel";
import { BackgroundStylePluginConfig, TypographyStylePluginConfig, ContainerStylePluginConfig } from "@paperbits/styles/contracts";
import { EventManager } from "@paperbits/common/events";


@Component({
    selector: "card-editor",
    template: template,
    injectable: "cardEditor"
})
export class CardEditor implements WidgetEditor<CardModel> {
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;

    constructor(
        private readonly viewManager: IViewManager,
        private readonly styleService: StyleService,
        private readonly eventManager: EventManager
    ) {
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();

        this.eventManager.addEventListener("onViewportChange", this.updateObservables.bind(this));
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
            }
        }

        this.appearanceStyle(this.model.styles.appearance);
    }

    public onContainerChange(config: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        Objects.setValue(`styles/instance/container/${viewport}/alignment`, this.model, config.alignment);
        Objects.setValue(`styles/instance/container/${viewport}/overflow`, this.model, config.overflow);

        this.onChange(this.model);
    }

    public onAppearanceChange(): void {
        Objects.setValue("styles/appearance", this.model, this.appearanceStyle());

        this.onChange(this.model);
    }
}
