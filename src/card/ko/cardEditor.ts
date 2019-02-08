import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import template from "./cardEditor.html";
import { IViewManager } from "@paperbits/common/ui";
import { IWidgetEditor } from "@paperbits/common/widgets";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { CardModel } from "../cardModel";
import { StyleService, } from "@paperbits/styles";
import { BackgroundContract, TypographyContract } from "@paperbits/styles/contracts";

@Component({
    selector: "card-editor",
    template: template,
    injectable: "cardEditor"
})
export class CardEditor {
    private readonly verticalAlignment: ko.Observable<string>;
    private readonly horizontalAlignment: ko.Observable<string>;

    public readonly alignment: ko.Observable<string>;
    public readonly scrollOnOverlow: ko.Observable<boolean>;
    public readonly background: ko.Observable<BackgroundContract>;
    public readonly typography: ko.Observable<TypographyContract>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;

    constructor(
        private readonly viewManager: IViewManager,
        private readonly styleService: StyleService
    ) {
        this.alignLeft.bind(this);
        this.alignRight.bind(this);
        this.alignCenter.bind(this);
        this.alignTop.bind(this);
        this.alignBottom.bind(this);
        this.alignMiddle.bind(this);
        this.onBackgroundUpdate = this.onBackgroundUpdate.bind(this);
        this.onTypographyUpdate = this.onTypographyUpdate.bind(this);

        this.viewManager = viewManager;
        this.initialize = this.initialize.bind(this);

        this.applyChanges = this.applyChanges.bind(this);

        this.alignment = ko.observable<string>();

        this.verticalAlignment = ko.observable<string>();
        this.horizontalAlignment = ko.observable<string>();

        this.scrollOnOverlow = ko.observable<boolean>();

        this.background = ko.observable<BackgroundContract>();
        this.typography = ko.observable<TypographyContract>();

        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();
    }

    @Param()
    public model: CardModel;

    @Event()
    public onChange: (model: CardModel) => void;

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */

    private applyChanges(): void {
        const viewport = this.viewManager.getViewport();

        switch (viewport) {
            case "xl":
                this.model.alignment.xl = this.alignment();
                break;

            case "lg":
                this.model.alignment.lg = this.alignment();
                break;

            case "md":
                this.model.alignment.md = this.alignment();
                break;

            case "sm":
                this.model.alignment.sm = this.alignment();
                break;

            case "xs":
                this.model.alignment.xs = this.alignment();
                break;

            default:
                throw new Error("Unknown viewport");
        }

        this.model.overflowX = this.model.overflowY = this.scrollOnOverlow() ? "scroll" : null;

        this.model.styles.appearance = this.appearanceStyle();

        this.onChange(this.model);
    }

    public alignContent(alignment: string): void {
        this.alignment(alignment);
    }

    private align(): void {
        this.alignment(`${this.verticalAlignment()} ${this.horizontalAlignment()}`);
    }

    public determineAlignment(viewport: string, model: CardModel): string {
        switch (viewport) {
            case "xl":
                return model.alignment.xl || this.determineAlignment("lg", model);
                break;

            case "lg":
                return model.alignment.lg || this.determineAlignment("md", model);
                break;

            case "md":
                return model.alignment.md || this.determineAlignment("sm", model);
                break;

            case "sm":
                return model.alignment.sm || this.determineAlignment("xs", model);
                break;

            case "xs":
                return model.alignment.xs || "start start";
                break;

            default:
                throw new Error("Unknown viewport");
        }
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        
        const viewport = this.viewManager.getViewport();

        const alignment = this.determineAlignment(viewport, this.model);
        this.alignment(alignment);

        this.scrollOnOverlow(this.model.overflowY === "scroll");

        const directions = this.alignment().split(" ");
        this.verticalAlignment(directions[0]);
        this.horizontalAlignment(directions[1]);

        const variations = await this.styleService.getComponentVariations("card");
        this.appearanceStyles(variations.filter(x => x.category === "appearance"));

        if (this.model.styles) {
            if (this.model.styles["instance"]) {
                const styles = await this.styleService.getStyleByKey(this.model.styles["instance"]);

                if (styles) {
                    this.background(styles.background);
                    this.typography(styles.typography);
                }
            }

            this.appearanceStyle(this.model.styles.appearance);
        }
        
        this.alignment.subscribe(this.applyChanges);
        this.scrollOnOverlow.subscribe(this.applyChanges);      
        this.appearanceStyle.subscribe(this.applyChanges);
    }

    public toggleHorizontal(): void {
        switch (this.horizontalAlignment()) {
            case "center":
                this.horizontalAlignment("around");
                break;
            case "around":
                this.horizontalAlignment("between");
                break;
            case "between":
                this.horizontalAlignment("center");
                break;
        }
    }

    public toggleVertical(): void {
        switch (this.verticalAlignment()) {
            case "center":
                this.verticalAlignment("around");
                break;
            case "around":
                this.verticalAlignment("between");
                break;
            case "between":
                this.verticalAlignment("center");
                break;
        }
    }

    public alignLeft(): void {
        this.horizontalAlignment("start");
        this.align();
    }

    public alignRight(): void {
        this.horizontalAlignment("end");
        this.align();
    }

    public alignCenter(): void {
        if (this.horizontalAlignment() === "center" || this.horizontalAlignment() === "around" || this.horizontalAlignment() === "between") {
            this.toggleHorizontal();
        }
        else {
            this.horizontalAlignment("center");
        }

        this.align();
    }

    public alignTop(): void {
        this.verticalAlignment("start");
        this.align();
    }

    public alignBottom(): void {
        this.verticalAlignment("end");
        this.align();
    }

    public alignMiddle(): void {
        if (this.verticalAlignment() === "center" || this.verticalAlignment() === "around" || this.verticalAlignment() === "between") {
            this.toggleVertical();
        }
        else {
            this.verticalAlignment("center");
        }

        this.align();
    }

    public onBackgroundUpdate(background: BackgroundContract): void {
        let instanceKey;

        if (this.model.styles && this.model.styles["instance"]) {
            instanceKey = this.model.styles["instance"];
        }
        else {
            instanceKey = `instances/card-${Utils.identifier()}`;
            this.model.styles.instance = instanceKey;
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
            instanceKey = `instances/card-${Utils.identifier()}`;
            this.model.styles.instance = instanceKey;
        }

        this.styleService.setInstanceStyle(instanceKey, { typography: typography });
        this.applyChanges();
    }
}
