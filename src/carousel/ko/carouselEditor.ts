
import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Objects from "@paperbits/common/objects";
import template from "./carouselEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { CarouselModel } from "../carouselModel";
import { SizeStylePluginConfig } from "@paperbits/styles/plugins";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { EventManager } from "@paperbits/common/events/eventManager";
import { Events } from "@paperbits/common/events";

@Component({
    selector: "carousel-editor",
    template: template
})
export class CarouselEditor {
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;
    public readonly showControls: ko.Observable<boolean>;
    public readonly showIndicators: ko.Observable<boolean>;
    public readonly autoplay: ko.Observable<boolean>;
    public readonly pauseOnHover: ko.Observable<boolean>;
    public readonly autoplayInterval: ko.Observable<number>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.sizeConfig = ko.observable<SizeStylePluginConfig>();
        this.showControls = ko.observable<boolean>();
        this.showIndicators = ko.observable<boolean>();
        this.autoplay = ko.observable<boolean>();
        this.pauseOnHover = ko.observable<boolean>();
        this.autoplayInterval = ko.observable<number>();
    }

    @Param()
    public model: CarouselModel;

    @Event()
    public onChange: (model: CarouselModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.updateObservables();
        this.sizeConfig.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.autoplay.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.pauseOnHover.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.autoplayInterval.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.showControls.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.showIndicators.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        const containerSizeStyles = Objects.getObjectAt<SizeStylePluginConfig>(`instance/size/${viewport}`, this.model.styles);
        this.sizeConfig(containerSizeStyles);

        this.autoplay(this.model.autoplay);
        this.pauseOnHover(this.model.pauseOnHover);
        this.autoplayInterval(this.model.autoplayInterval);
        this.showControls(this.model.showControls);
        this.showIndicators(this.model.showIndicators);
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

        this.model.autoplay = this.autoplay();
        this.model.pauseOnHover = this.pauseOnHover();
        this.model.autoplayInterval = this.autoplayInterval();
        this.model.showControls = this.showControls();
        this.model.showIndicators = this.showIndicators();

        this.onChange(this.model);
    }

    public onSizeUpdate(sizeConfig: SizeStylePluginConfig): void {
        this.sizeConfig(sizeConfig);
    }
}