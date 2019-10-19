import * as ko from "knockout";
import template from "./buttonEditor.html";
import { StyleService } from "@paperbits/styles";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { ButtonModel } from "../buttonModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { StyleItemContract } from "@paperbits/styles/contracts/styleItemContract";

@Component({
    selector: "button-editor",
    template: template,
    injectable: "buttonEditor"
})
export class ButtonEditor {
    public readonly label: ko.Observable<string>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly hyperlinkTitle: ko.Observable<string>;
    public readonly appearanceStyle: ko.Observable<StyleItemContract>;
    public readonly sizeStyles: ko.ObservableArray<any>;
    public readonly sizeStyle: ko.Observable<any>;

    constructor(private readonly styleService: StyleService) {
        this.label = ko.observable<string>();
        this.appearanceStyle = ko.observable<any>();
        this.sizeStyles = ko.observableArray<any>();
        this.sizeStyle = ko.observable<any>();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkTitle = ko.observable<string>();
    }

    @Param()
    public model: ButtonModel;

    @Event()
    public onChange: (model: ButtonModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        const buttonVariations = await this.styleService.getComponentVariations("button");
        this.sizeStyles(buttonVariations.filter(x => x.category === "size").concat({ displayName: "Default", key: undefined }));

        this.label(this.model.label);

        if (this.model.styles) {
            const selectedAppearence = buttonVariations.find(x => x.category === "appearance" && x.key === this.model.styles.appearance);
            this.sizeStyle(this.model.styles.size);
            this.appearanceStyle(selectedAppearence);
        }

        this.hyperlink(this.model.hyperlink);
        this.onHyperlinkChange(this.model.hyperlink);

        this.sizeStyle.subscribe(this.applyChanges);
        this.appearanceStyle.subscribe(this.applyChanges);
        this.label.subscribe(this.applyChanges);
        this.hyperlink.subscribe(this.applyChanges);
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        if (hyperlink) {
            this.hyperlinkTitle(hyperlink.title);
            this.hyperlink(hyperlink);
        }
        else {
            this.hyperlinkTitle("Add a link...");
        }
    }

    public onAppearanceSelected(snippet: StyleItemContract): void {
        if (snippet) {
            this.appearanceStyle(snippet);
        }
    }

    private applyChanges(): void {
        this.model.label = this.label();
        this.model.hyperlink = this.hyperlink();
        this.model.styles = {
            appearance: this.appearanceStyle().key,
            size: this.sizeStyle()
        };

        this.onChange(this.model);
    }
}