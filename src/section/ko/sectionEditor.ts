
import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Objects from "@paperbits/common/objects";
import template from "./sectionEditor.html";
import { IViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { SectionModel } from "../sectionModel";
import { GridModel } from "../../grid-layout-section";
import {
    BackgroundStylePluginConfig,
    TypographyStylePluginConfig,
    MarginStylePluginConfig,
    SizeStylePluginConfig
} from "@paperbits/styles/contracts";


const styleKeySnapTop = "utils/block/snapToTop";
const styleKeySnapBottom = "utils/block/snapToBottom";
const styleKeyStretch = "utils/block/stretch";

@Component({
    selector: "layout-section-editor",
    template: template,
    injectable: "sectionEditor"
})
export class SectionEditor {
    public readonly stickTo: ko.Observable<string>;
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly stretch: ko.Observable<boolean>;

    public readonly minWidth: ko.Observable<string>;
    public readonly maxWidth: ko.Observable<string>;
    public readonly minHeight: ko.Observable<string>;
    public readonly maxHeight: ko.Observable<string>;

    public readonly marginTop: ko.Observable<string>;
    public readonly marginLeft: ko.Observable<string>;
    public readonly marginRight: ko.Observable<string>;
    public readonly marginBottom: ko.Observable<string>;

    constructor(private readonly viewManager: IViewManager) {
        this.initialize = this.initialize.bind(this);
        this.onBackgroundUpdate = this.onBackgroundUpdate.bind(this);
        this.onTypographyUpdate = this.onTypographyUpdate.bind(this);
        this.stickTo = ko.observable<string>("none");
        this.stretch = ko.observable<boolean>(false);
        this.background = ko.observable<BackgroundStylePluginConfig>();
        this.typography = ko.observable<TypographyStylePluginConfig>();
        this.minWidth = ko.observable<string>();
        this.maxWidth = ko.observable<string>();
        this.minHeight = ko.observable<string>();
        this.maxHeight = ko.observable<string>();
        this.marginTop = ko.observable<string>();
        this.marginLeft = ko.observable<string>();
        this.marginRight = ko.observable<string>();
        this.marginBottom = ko.observable<string>();
    }

    @Param()
    public model: SectionModel;

    @Event()
    public onChange: (model: SectionModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const viewport = this.viewManager.getViewport();

        if (this.model.styles) {
            if (this.model.styles["instance"]) {
                const sectionStyles = this.model.styles["instance"];

                if (sectionStyles) {
                    this.background(sectionStyles.background);
                    this.typography(sectionStyles.typography);
                }
            }

            if (this.model.styles["size"]) {
                this.stretch(true);
            }

            const stickToStyles = <any>Objects.getObjectAt(`instance/stickTo/${viewport}`, this.model.styles);

            if (stickToStyles) {
                this.stickTo(stickToStyles);
            }
        }

        const gridModel = <GridModel>this.model.widgets[0];
        const gridStyles = gridModel.styles;
        const sizeStyles = <any>Objects.getObjectAt(`instance/size/${viewport}`, gridStyles);
        const marginStyles = <any>Objects.getObjectAt(`instance/margin/${viewport}`, gridStyles);
        
        if (sizeStyles) {
            this.minWidth(sizeStyles.minWidth);
            this.maxWidth(sizeStyles.maxWidth);
            this.minHeight(sizeStyles.minHeight);
            this.maxHeight(sizeStyles.maxHeight);
        }

        if (marginStyles) {
            this.marginTop(marginStyles.top);
            this.marginLeft(marginStyles.left);
            this.marginRight(marginStyles.right);
            this.marginBottom(marginStyles.bottom);
        }

        this.stickTo.subscribe(this.applyChanges);
        this.stretch.subscribe(this.applyChanges);
        this.background.subscribe(this.applyChanges);
        this.typography.subscribe(this.applyChanges);

        this.minWidth.subscribe(this.applyChanges);
        this.maxWidth.subscribe(this.applyChanges);
        this.minHeight.subscribe(this.applyChanges);
        this.maxHeight.subscribe(this.applyChanges);

        this.marginTop.subscribe(this.applyChanges);
        this.marginLeft.subscribe(this.applyChanges);
        this.marginRight.subscribe(this.applyChanges);
        this.marginBottom.subscribe(this.applyChanges);
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private applyChanges(): void {
        const viewport = this.viewManager.getViewport();
        this.model.styles = this.model.styles || {};

        // if (this.stretch()) {
        //     this.model.styles["size"] = { xs: styleKeyStretch };
        // }
        // else {
        //     delete this.model.styles["size"];
        // }

        if (this.model["styles"]["instance"] && !this.model["styles"]["instance"]["key"]) {
            this.model["styles"]["instance"]["key"] = Utils.randomClassName();
        }

        const gridModel = <GridModel>this.model.widgets[0];
        const gridStyles = gridModel.styles;

        const sizeStyles: SizeStylePluginConfig = {
            minWidth: this.minWidth(),
            maxWidth: this.maxWidth(),
            minHeight: this.minHeight(),
            maxHeight: this.maxHeight()
        };

        Objects.cleanupObject(sizeStyles);
        Objects.setValue(`instance/size/${viewport}`, gridStyles, sizeStyles);

        const marginStyle: MarginStylePluginConfig = {
            top: this.marginTop(),
            bottom: this.marginBottom(),
            left: "auto",
            right: "auto"
            // Uncomment when box editor gets support for "auto".
            // marginLeft: this.marginLeft(),
            // marginRight: this.marginRight()
        };

        Objects.cleanupObject(marginStyle);
        Objects.setValue(`instance/margin/${viewport}`, gridStyles, marginStyle);

        Objects.setValue(`instance/stickTo/${viewport}`, this.model.styles, this.stickTo());

        this.onChange(this.model);
    }

    public onBackgroundUpdate(background: BackgroundStylePluginConfig): void {
        Objects.setStructure("styles/instance/background", this.model);
        this.model["styles"]["instance"]["background"] = background;
        this.applyChanges();
    }

    public onTypographyUpdate(typography: TypographyStylePluginConfig): void {
        Objects.setStructure("styles/instance/typography", this.model);
        this.model["styles"]["instance"]["typography"] = typography;
        this.applyChanges();
    }
}