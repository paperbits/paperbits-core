
import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Objects from "@paperbits/common/objects";
import template from "./carouselEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { CarouselModel } from "../carouselModel";
import { SizeStylePluginConfig } from "@paperbits/styles/contracts";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { EventManager } from "@paperbits/common/events/eventManager";
import { CommonEvents } from "@paperbits/common/events";

@Component({
    selector: "carousel-editor",
    template: template
})
export class CarouselEditor {
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.sizeConfig = ko.observable<SizeStylePluginConfig>();
    }

    @Param()
    public model: CarouselModel;

    @Event()
    public onChange: (model: CarouselModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.updateObservables();
        this.sizeConfig.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.eventManager.addEventListener(CommonEvents.onViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        const containerSizeStyles = Objects.getObjectAt<SizeStylePluginConfig>(`instance/size/${viewport}`, this.model.styles);
        this.sizeConfig(containerSizeStyles);
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

        const containerSizeStyles: SizeStylePluginConfig = this.sizeConfig();
        Objects.setValue(`instance/size/${viewport}`, this.model.styles, containerSizeStyles);

        this.onChange(this.model);
    }

    public onSizeUpdate(sizeConfig: SizeStylePluginConfig): void {
        this.sizeConfig(sizeConfig);
    }
}