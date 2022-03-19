import * as ko from "knockout";
import * as Objects from "@paperbits/common/objects";
import template from "./buttonEditor.html";
import { StyleHelper, StyleService } from "@paperbits/styles";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { ButtonModel } from "../buttonModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { Display } from "@paperbits/styles/plugins";
import { ViewManager } from "@paperbits/common/ui";
import { EventManager, Events } from "@paperbits/common/events";
import { SelectOption } from "@paperbits/common/ui/selectOption";
import { VariationContract } from "@paperbits/common/styles";

@Component({
    selector: "button-editor",
    template: template
})
export class ButtonEditor {
    public readonly label: ko.Observable<string>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly hyperlinkTitle: ko.Observable<string>;
    public readonly buttonVariationKey: ko.Observable<string>;
    public readonly buttonVariations: ko.ObservableArray<VariationContract>;
    public readonly displayStyle: ko.Observable<string>;

    public displayOptions: SelectOption[] = [
        { value: null, text: "(Inherit)" },
        { value: Display.Inline, text: "Visible" },
        { value: Display.None, text: "Hidden" }
    ];

    constructor(
        private readonly styleService: StyleService,
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.label = ko.observable<string>();
        this.buttonVariations = ko.observableArray();
        this.buttonVariationKey = ko.observable();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkTitle = ko.observable<string>();
        this.displayStyle = ko.observable<string>();
        this.updateObservables = this.updateObservables.bind(this);
    }

    @Param()
    public model: ButtonModel;

    @Event()
    public onChange: (model: ButtonModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const variations = await this.styleService.getComponentVariations("button");
        this.buttonVariations(variations.filter(x => x.category === "appearance"));

        await this.updateObservables();

        this.buttonVariationKey.subscribe(this.applyChanges);
        this.label.subscribe(this.applyChanges);
        this.hyperlink.subscribe(this.applyChanges);

        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        this.label(this.model.label);

        if (this.model.styles) {
            const viewport = this.viewManager.getViewport();
            const localStyles = this.model.styles;

            this.buttonVariationKey(<string>this.model.styles?.appearance);

            const displayStyle = <Display>StyleHelper.getPluginConfigForLocalStyles(localStyles, "display", viewport);
            this.displayStyle(displayStyle);
        }

        this.hyperlink(this.model.hyperlink);
        this.onHyperlinkChange(this.model.hyperlink);
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        if (hyperlink) {
            this.hyperlinkTitle(hyperlink.title);
        }
        else {
            this.hyperlinkTitle("Add a link...");
        }

        this.hyperlink(hyperlink);
    }

    public onRoleSelect(roles: string[]): void {
        this.model.roles = roles;
        this.applyChanges();
    }

    public onIconSelect(iconKey: string): void {
        this.model.iconKey = iconKey;
        this.applyChanges();
    }

    public onDisplayChange(): void {
        const viewport = this.viewManager.getViewport();
        const newViewportValue = this.displayStyle();

        StyleHelper.setVisibility(this.model.styles, newViewportValue, viewport, this.viewManager);
        this.onChange(this.model);
    }

    private applyChanges(): void {
        this.model.label = this.label();
        this.model.hyperlink = this.hyperlink();
        this.model.styles["appearance"] = this.buttonVariationKey();

        this.onChange(this.model);
    }
}