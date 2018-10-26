import * as ko from "knockout";
import template from "./sectionEditor.html";
import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IWidgetEditor } from "@paperbits/common/widgets";
import { BackgroundModel } from "@paperbits/common/widgets/background/backgroundModel";
import { Component } from "../../ko/decorators/component.decorator";
import { SectionModel } from "../sectionModel";

@Component({
    selector: "layout-section-editor",
    template: template,
    injectable: "sectionEditor"
})
export class SectionEditor implements IWidgetEditor {
    private section: SectionModel;
    private applyChangesCallback: () => void;

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
        this.setWidgetModel = this.setWidgetModel.bind(this);
        this.onMediaSelected = this.onMediaSelected.bind(this);
        this.onColorSelected = this.onColorSelected.bind(this);
        this.clearBackground = this.clearBackground.bind(this);

        this.layout = ko.observable<string>();
        this.layout.subscribe(this.onChange.bind(this));

        this.padding = ko.observable<string>();
        this.padding.subscribe(this.onChange.bind(this));

        this.snap = ko.observable<string>();
        this.snap.subscribe(this.onChange.bind(this));

        this.stretch = ko.observable<boolean>();
        this.stretch.subscribe(this.onChange.bind(this));

        this.backgroundSize = ko.observable<string>();
        this.backgroundSize.subscribe(this.onChange.bind(this));

        this.backgroundPosition = ko.observable<string>();
        this.backgroundPosition.subscribe(this.onChange.bind(this));

        this.backgroundColorKey = ko.observable<string>();
        this.backgroundColorKey.subscribe(this.onChange.bind(this));

        this.backgroundRepeat = ko.observable<string>();
        this.backgroundRepeat.subscribe(this.onChange.bind(this));

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

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private onChange(): void {
        if (!this.applyChangesCallback) {
            return;
        }
        this.section.container = this.layout();
        this.section.padding = this.padding();
        this.section.snap = this.snap();
        this.section.height = this.stretch() ? "stretch" : null;

        if (this.section.background) {
            this.section.background.colorKey = this.backgroundColorKey();
            this.section.background.size = this.backgroundSize();
            this.section.background.position = this.backgroundPosition();
            this.section.background.repeat = this.backgroundRepeat();
            this.background(this.section.background);
        }

        this.applyChangesCallback();
    }

    public onMediaSelected(media: MediaContract): void {
        this.section.background = this.section.background || {};
        this.section.background.sourceKey = media.permalinkKey;
        this.section.background.sourceUrl = media.downloadUrl;
        this.section.background.sourceType = "picture";

        this.background(this.section.background);
        this.applyChangesCallback();
    }

    public onColorSelected(colorKey: string): void {
        this.section.background = this.section.background || {};
        this.section.background.colorKey = colorKey;

        this.background(this.section.background);
        this.applyChangesCallback();
    }

    public clearBackground(): void {
        this.section.background = null;

        this.backgroundColorKey(null);
        this.background(null);
        this.applyChangesCallback();
    }

    public setWidgetModel(section: SectionModel, applyChangesCallback?: () => void): void {
        this.section = section;

        this.layout(this.section.container);
        this.padding(this.section.padding);
        this.snap(this.section.snap);
        this.stretch(this.section.height === "stretch");

        if (this.section.background) {
            this.backgroundColorKey(this.section.background.colorKey);
            this.backgroundPosition(this.section.background.position);
            this.backgroundSize(this.section.background.size);
            this.backgroundRepeat(this.section.background.repeat);
        }

        this.background(this.section.background);

        this.applyChangesCallback = applyChangesCallback;
    }

    public comingSoon(): void {
        alert("This feature is coming soon!");
    }
}
