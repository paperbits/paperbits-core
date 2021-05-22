import * as ko from "knockout";
import template from "./dismissButtonEditor.html";
import { StyleService } from "@paperbits/styles";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { DismissButtonModel } from "../dismissButtonModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";


@Component({
    selector: "dismiss-button-editor",
    template: template
})
export class DismissButtonEditor {
    public readonly label: ko.Observable<string>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;
    public readonly hyperlinkTitle: ko.Observable<string>;
    public readonly appearanceStyle: ko.Observable<string>;
    public readonly appearanceStyles: ko.ObservableArray<any>;

    constructor(private readonly styleService: StyleService) {
        this.label = ko.observable<string>();
        this.appearanceStyles = ko.observableArray();
        this.appearanceStyle = ko.observable();
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkTitle = ko.observable<string>();
    }

    @Param()
    public model: DismissButtonModel;

    @Event()
    public onChange: (model: DismissButtonModel) => void;

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

    public onIconSelect(iconKey: string): void {
        this.model.iconKey = iconKey;
        this.applyChanges();
    }

    private applyChanges(): void {
        this.model.label = this.label();
        this.model.styles = {
            appearance: this.appearanceStyle()
        };

        this.onChange(this.model);
    }
}