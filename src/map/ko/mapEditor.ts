import * as ko from "knockout";
import template from "./mapEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { MapModel, MarkerModel } from "../mapModel";
import { SizeStylePluginConfig } from "@paperbits/styles/plugins";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { StyleHelper } from "@paperbits/styles";
import { ViewManager } from "@paperbits/common/ui";
import { Events, EventManager } from "@paperbits/common/events";
import { MediaContract } from "@paperbits/common/media";
import { BackgroundModel } from "@paperbits/common/widgets/background";
import { HyperlinkModel, IPermalinkResolver } from "@paperbits/common/permalinks";


interface MapTypeOption {
    label: string;
    value: string;
}

@Component({
    selector: "paperbits-map-editor",
    template: template
})
export class MapEditor {
    public readonly location: ko.Observable<string>;
    public readonly caption: ko.Observable<string>;
    public readonly zoom: ko.Observable<number>;
    public readonly layout: ko.Observable<string>;
    public readonly mapType: ko.Observable<string>;
    public readonly mapTypeOptions: ko.ObservableArray<MapTypeOption>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;
    public readonly background: ko.Observable<BackgroundModel>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly hyperlinkTitle: ko.Computed<string>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager,
        private readonly mediaPermalinkResolver: IPermalinkResolver,
        private readonly popupPermalinkResolver: IPermalinkResolver
    ) {
        this.location = ko.observable<string>();
        this.caption = ko.observable<string>();
        this.zoom = ko.observable(17);
        this.layout = ko.observable<string>();
        this.mapType = ko.observable<string>("terrain");
        this.sizeConfig = ko.observable();
        this.background = ko.observable();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkTitle = ko.computed<string>(() => this.hyperlink() ? this.hyperlink().title : "Attach popup...");

        this.mapTypeOptions = ko.observableArray<MapTypeOption>([
            { label: "Terrain", value: "terrain" },
            { label: "Satellite", value: "satellite" },
            { label: "Hybrid", value: "hybrid" }
        ]);
    }

    @Param()
    public model: MapModel;

    @Event()
    public onChange: (model: MapModel) => void;

    @OnMounted()
    public initialize(): void {
        this.location(this.model.location);
        this.caption(this.model.caption);
        this.zoom(this.model.zoom);
        this.mapType(this.model.mapType);

        this.updateObservables();
        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);

        this.location
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.caption
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.zoom
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);

        this.mapType
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);
    }

    private async updateObservables(): Promise<void> {
        const viewport = this.viewManager.getViewport();

        const sizeStyles = StyleHelper.getPluginConfigForLocalStyles(this.model.styles, "size", viewport);
        this.sizeConfig(sizeStyles);

        if (this.model.marker?.sourceKey) {
            const background = new BackgroundModel();
            background.sourceKey = this.model.marker.sourceKey;
            background.sourceUrl = await this.mediaPermalinkResolver.getUrlByTargetKey(this.model.marker.sourceKey);
            this.background(background);
        }

        if (this.model.marker?.popupKey) {
            const hyperlink = await this.popupPermalinkResolver.getHyperlinkByTargetKey(this.model.marker?.popupKey);
            this.hyperlink(hyperlink);
        }
    }

    private applyChanges(): void {
        this.model.caption = this.caption();
        this.model.location = this.location();
        this.model.zoom = this.zoom();
        this.model.mapType = this.mapType();
        this.onChange(this.model);
    }

    public onSizeChange(pluginConfig: SizeStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "size", pluginConfig, viewport);

        this.onChange(this.model);
    }

    public onMarkerIconChange(media: MediaContract): void {
        if (!media) {
            this.background(null);
            this.model.marker = null;
        }
        else {
            this.model.marker = new MarkerModel(media.key);

            const background = new BackgroundModel(); // TODO: Let's use proper model here
            background.sourceKey = media.key;
            background.sourceUrl = media.downloadUrl;
            background.size = "contain";
            background.position = "center center";
            this.background(background);
        }

        this.onChange(this.model);
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);

        if (!this.model.marker) {
            this.model.marker = new MarkerModel();
        }

        this.model.marker.popupKey = hyperlink.targetKey;

        this.onChange(this.model);
    }
}