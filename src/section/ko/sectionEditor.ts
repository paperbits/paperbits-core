
import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Objects from "@paperbits/common/objects";
import template from "./sectionEditor.html";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { SectionModel } from "../sectionModel";
import { StyleService, } from "@paperbits/styles";
import { BackgroundContract, TypographyContract } from "@paperbits/styles/contracts";

const styleKeySnapTop = "utils/block/snapToTop";
const styleKeySnapBottom = "utils/block/snapToBottom";
const styleKeyStretch = "utils/block/stretch";

@Component({
    selector: "layout-section-editor",
    template: template,
    injectable: "sectionEditor"
})
export class SectionEditor {
    public readonly layout: ko.Observable<string>;
    public readonly padding: ko.Observable<string>;
    public readonly snap: ko.Observable<string>;
    public readonly background: ko.Observable<BackgroundContract>;
    public readonly typography: ko.Observable<TypographyContract>;
    public readonly stretch: ko.Observable<boolean>;

    constructor(private readonly styleService: StyleService) {
        this.initialize = this.initialize.bind(this);
        this.onBackgroundUpdate = this.onBackgroundUpdate.bind(this);
        this.onTypographyUpdate = this.onTypographyUpdate.bind(this);

        this.layout = ko.observable<string>();
        this.padding = ko.observable<string>();
        this.snap = ko.observable<string>("none");
        this.stretch = ko.observable<boolean>(false);
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

        if (this.model.styles) {
            if (this.model.styles["instance"]) {
                const sectionStyles = await this.styleService.getStyleByKey(this.model.styles["instance"]);

                if (sectionStyles) {
                    this.background(sectionStyles.background);
                    this.typography(sectionStyles.typography);
                }
            }

            if (this.model.styles["size"]) {
                this.stretch(true);
            }

            if (this.model.styles["snap"]) {
                const snapStyleKey = this.model.styles["snap"]["xs"];

                switch (snapStyleKey) {
                    case styleKeySnapTop:
                        this.snap("top");
                        break;

                    case styleKeySnapBottom:
                        this.snap("bottom");
                        break;
                }
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
        this.model.styles = this.model.styles || {};
        this.model.container = this.layout();
        this.model.padding = this.padding();

        if (this.stretch()) {
            this.model.styles["size"] = { xs: styleKeyStretch };
        }
        else {
            delete this.model.styles["size"];
        }

        switch (this.snap()) {
            case "top":
                this.model.styles["snap"] = { xs: styleKeySnapTop };
                break;

            case "bottom":
                this.model.styles["snap"] = { xs: styleKeySnapBottom };
                break;

            default:
                delete this.model.styles["snap"];
        }

        this.onChange(this.model);
    }

    public onBackgroundUpdate(background: BackgroundContract): void {
        Objects.setStructure("styles/instance/background", this.model);
        this.model["styles"]["instance"]["background"] = background;

        this.applyChanges();
    }

    public onTypographyUpdate(typography: TypographyContract): void {
        Objects.setStructure("styles/instance/typography", this.model);
        this.model["styles"]["instance"]["typography"] = typography;

        this.applyChanges();
    }

    
    // public onBackgroundUpdate(background: BackgroundContract): void {
    //     Objects.setValue("styles/instance/background", this.model, Objects.clone(background));
    //     this.applyChanges();
    // }

    // public onTypographyUpdate(typography: TypographyContract): void {
    //     Objects.setValue("styles/instance/typography", this.model, typography);
    //     this.applyChanges();
    // }
}