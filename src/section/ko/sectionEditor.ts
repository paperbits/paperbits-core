import { ColorContract } from "@paperbits/styles/contracts";
import * as ko from "knockout";
import template from "./sectionEditor.html";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { SectionModel } from "../sectionModel";

@Component({
    selector: "layout-section-editor",
    template: template,
    injectable: "sectionEditor"
})
export class SectionEditor {
    public readonly layout: KnockoutObservable<string>;
    public readonly padding: KnockoutObservable<string>;
    public readonly snap: KnockoutObservable<string>;
    public readonly backgroundSize: KnockoutObservable<string>;
    public readonly backgroundPosition: KnockoutObservable<string>;
    public readonly backgroundColorKey: KnockoutObservable<string>;
    public readonly backgroundRepeat: KnockoutObservable<string>;
    public readonly backgroundHasPicture: KnockoutComputed<boolean>;
    public readonly backgroundHasColor: KnockoutComputed<boolean>;
    public readonly background: KnockoutObservable<BackgroundModel>;
    public readonly stretch: KnockoutObservable<boolean>;

    constructor() {
        this.initialize = this.initialize.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.onColorSelected = this.onColorSelected.bind(this);
        this.clearBackground = this.clearBackground.bind(this);

        this.layout = ko.observable<string>();
        this.padding = ko.observable<string>();
        this.snap = ko.observable<string>();
        this.stretch = ko.observable<boolean>();
        this.backgroundSize = ko.observable<string>();
        this.backgroundPosition = ko.observable<string>();
        this.backgroundColorKey = ko.observable<string>();
        this.backgroundRepeat = ko.observable<string>();
        this.background = ko.observable<BackgroundModel>();

        this.backgroundHasPicture = ko.pureComputed(() =>
            this.background() &&
            this.background().sourceKey &&
            this.background().sourceKey !== null
        );

        this.backgroundHasColor = ko.pureComputed(() =>
            this.background() &&
            this.background().colorKey &&
            this.background().colorKey !== null
        );
    }

    @Param()
    public model: SectionModel;

    @Event()
    public onChange: (model: SectionModel) => void;

    @OnMounted()
    public initialize(): void {
        this.layout(this.model.container);
        this.padding(this.model.padding);
        this.snap(this.model.snap);
        this.stretch(this.model.height === "stretch");

        if (this.model.background) {
            this.backgroundColorKey(this.model.background.colorKey);
            this.backgroundPosition(this.model.background.position);
            this.backgroundSize(this.model.background.size);
            this.backgroundRepeat(this.model.background.repeat);
        }

        this.background(this.model.background);

        this.layout.subscribe(this.applyChanges.bind(this));
        this.padding.subscribe(this.applyChanges.bind(this));
        this.snap.subscribe(this.applyChanges.bind(this));
        this.stretch.subscribe(this.applyChanges.bind(this));
        this.backgroundSize.subscribe(this.applyChanges.bind(this));
        this.backgroundPosition.subscribe(this.applyChanges.bind(this));
        this.backgroundColorKey.subscribe(this.applyChanges.bind(this));
        this.backgroundRepeat.subscribe(this.applyChanges.bind(this));
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private applyChanges(): void {
        this.model.container = this.layout();
        this.model.padding = this.padding();
        this.model.snap = this.snap();
        this.model.height = this.stretch() ? "stretch" : null;

        if (this.model.background) {
            this.model.background.size = this.backgroundSize();
            this.model.background.position = this.backgroundPosition();
            this.model.background.repeat = this.backgroundRepeat();
        }

        this.onChange(this.model);
    }

    public onMediaSelected(media: MediaContract): void {
        this.model.background = this.model.background || {};
        this.model.background.sourceKey = media.permalinkKey;
        this.model.background.sourceUrl = media.downloadUrl;
        this.model.background.sourceType = "picture";

        this.background(this.model.background);
        this.applyChanges();
    }

    public onColorSelected(color: ColorContract): void {
        this.model.background = this.model.background || {};
        this.model.background.colorKey = color ? color.key : undefined;

        this.background(this.model.background);
        this.applyChanges();
    }

    public clearBackground(): void {
        this.model.background = null;
        this.backgroundColorKey(null);
        this.background(null);
        this.applyChanges();
    }
}
