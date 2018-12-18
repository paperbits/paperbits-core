
import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import template from "./sectionEditor.html";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { SectionModel } from "../sectionModel";
import { StyleService, } from "@paperbits/styles";
import { BackgroundContract, TypographyContract } from "@paperbits/styles/contracts";

@Component({
    selector: "layout-section-editor",
    template: template,
    injectable: "sectionEditor"
})
export class SectionEditor {
    public readonly layout: KnockoutObservable<string>;
    public readonly padding: KnockoutObservable<string>;
    public readonly snap: KnockoutObservable<string>;
    public readonly background: KnockoutObservable<BackgroundContract>;
    public readonly typography: KnockoutObservable<TypographyContract>;
    public readonly stretch: KnockoutObservable<boolean>;

    constructor(private readonly styleService: StyleService) {
        this.initialize = this.initialize.bind(this);
        this.onBackgroundUpdate = this.onBackgroundUpdate.bind(this);
        this.onTypographyUpdate = this.onTypographyUpdate.bind(this);

        this.layout = ko.observable<string>();
        this.padding = ko.observable<string>();
        this.snap = ko.observable<string>();
        this.stretch = ko.observable<boolean>();
        this.background = ko.observable<BackgroundContract>();
        this.typography = ko.observable<TypographyContract>();
    }

    @Param()
    public model: SectionModel;

    @Event()
    public onChange: (model: SectionModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.layout(this.model.container);
        this.padding(this.model.padding);
        this.snap(this.model.snap);
        this.stretch(this.model.height === "stretch");

        if (this.model.styles && this.model.styles["instance"]) {
            const sectionStyles = await this.styleService.getStyleByKey(this.model.styles["instance"]);

            if (sectionStyles) {
                this.background(sectionStyles.background);
                this.typography(sectionStyles.typography);
            }
        }

        this.layout.subscribe(this.applyChanges.bind(this));
        this.padding.subscribe(this.applyChanges.bind(this));
        this.snap.subscribe(this.applyChanges.bind(this));
        this.stretch.subscribe(this.applyChanges.bind(this));
        this.background.subscribe(this.applyChanges.bind(this));
        this.typography.subscribe(this.applyChanges.bind(this));
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private applyChanges(): void {
        this.model.container = this.layout();
        this.model.padding = this.padding();
        this.model.snap = this.snap();
        this.model.height = this.stretch() ? "stretch" : undefined;

        this.onChange(this.model);
    }

    public onBackgroundUpdate(background: BackgroundContract): void {
        let instanceKey;

        if (this.model.styles && this.model.styles["instance"]) {
            instanceKey = this.model.styles["instance"];
        }
        else {
            instanceKey = `instances/section-${Utils.identifier()}`;
            this.model.styles = { instance: instanceKey };
        }

        this.styleService.setInstanceStyle(instanceKey, { background: background });
        this.applyChanges();
    }

    public onTypographyUpdate(typography: TypographyContract): void {
        let instanceKey;

        if (this.model.styles && this.model.styles["instance"]) {
            instanceKey = this.model.styles["instance"];
        }
        else {
            instanceKey = `instances/section-${Utils.identifier()}`;
            this.model.styles = { instance: instanceKey };
        }

        this.styleService.setInstanceStyle(instanceKey, { typography: typography });
        this.applyChanges();
    }
}