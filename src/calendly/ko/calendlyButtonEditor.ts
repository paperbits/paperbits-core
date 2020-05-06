import * as ko from "knockout";
import template from "./calendlyButtonEditor.html";
import { StyleService } from "@paperbits/styles";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { CalendlyButtonModel } from "../calendlyButtonModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { LocalStyles } from "@paperbits/common/styles";


@Component({
    selector: "calendly-button-editor",
    template: template
})
export class CalendlyButtonEditor {
    public readonly label: ko.Observable<string>;
    public readonly calendlyLink: ko.Observable<string>;
    public readonly appearanceStyle: ko.Observable<string>;
    public readonly appearanceStyles: ko.ObservableArray<any>;

    constructor(private readonly styleService: StyleService) {
        this.label = ko.observable<string>();
        this.calendlyLink = ko.observable<string>();
        this.appearanceStyles = ko.observableArray();
        this.appearanceStyle = ko.observable();
    }

    @Param()
    public model: CalendlyButtonModel;

    @Event()
    public onChange: (model: CalendlyButtonModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.label(this.model.label);

        if (this.model.styles) {
            const variations = await this.styleService.getComponentVariations("button");
            this.appearanceStyles(variations.filter(x => x.category === "appearance"));
            this.appearanceStyle(<string>this.model.styles?.appearance);
        }

        this.appearanceStyle.subscribe(this.applyChanges);
        this.label.subscribe(this.applyChanges);
        this.calendlyLink.subscribe(this.applyChanges);
    }

    public onRoleSelect(roles: string[]): void {
        this.model.roles = roles;
        this.applyChanges();
    }

    private applyChanges(): void {
        this.model.label = this.label();
        this.model.calendlyLink = this.calendlyLink();
        this.model.styles = {
            appearance: this.appearanceStyle()
        };

        this.onChange(this.model);
    }
}