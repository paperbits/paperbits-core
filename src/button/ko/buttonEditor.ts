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
import { BreakpointValues, distinct } from "@paperbits/common";


interface SelectOption {
    value: string;
    text: string;
}

@Component({
    selector: "button-editor",
    template: template
})
export class ButtonEditor {
    public readonly label: ko.Observable<string>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly hyperlinkTitle: ko.Observable<string>;
    public readonly appearanceStyle: ko.Observable<string>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
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
        this.appearanceStyles = ko.observableArray();
        this.appearanceStyle = ko.observable();
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
        this.appearanceStyles(variations.filter(x => x.category === "appearance"));

        await this.updateObservables();

        this.appearanceStyle.subscribe(this.applyChanges);
        this.label.subscribe(this.applyChanges);
        this.hyperlink.subscribe(this.applyChanges);

        this.eventManager.addEventListener(Events.ViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        this.label(this.model.label);

        if (this.model.styles) {
            const viewport = this.viewManager.getViewport();
            const localStyles = this.model.styles;

            this.appearanceStyle(<string>this.model.styles?.appearance);

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
        const displayStyle = this.model.styles?.instance?.display;
        const newViewportValue = this.displayStyle();

        let otherValues = [];

        const newState = displayStyle ? Objects.clone(displayStyle) : {};
        newState[viewport] = newViewportValue;

        otherValues = Object.values(newState);

        const optionText = this.displayOptions.find(x => x.value === newViewportValue).text;

        if (otherValues.includes(Display.None) && !otherValues.includes(Display.Inline) && !otherValues.includes(Display.Block)) {
            this.viewManager.notifyError("Button: Visibility", `Button should be set "Visible" on at least one other screen size, before you can set "${optionText}" on current one.`);
            return;
        }

        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "display", this.displayStyle(), viewport);

        this.onChange(this.model);
    }

    private applyChanges(): void {
        this.model.label = this.label();
        this.model.hyperlink = this.hyperlink();
        this.model.styles["appearance"] = this.appearanceStyle();

        this.onChange(this.model);
    }
}