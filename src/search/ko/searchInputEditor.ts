import * as ko from "knockout";
import template from "./searchInputEditor.html";
import { StyleService } from "@paperbits/styles";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { SearchInputModel } from "../searchInputModel";

@Component({
    selector: "search-input-editor",
    template: template
})
export class SearchInputEditor {
    public readonly label: ko.Observable<string>;
    public readonly placeholder: ko.Observable<string>;

    public readonly appearanceStyle: ko.Observable<string>;
    public readonly appearanceStyles: ko.ObservableArray<any>;

    constructor(private readonly styleService: StyleService) {
        this.label = ko.observable<string>();
        this.placeholder = ko.observable<string>();
        this.appearanceStyles = ko.observableArray();
        this.appearanceStyle = ko.observable();
    }

    @Param()
    public model: SearchInputModel;

    @Event()
    public onChange: (model: SearchInputModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.label(this.model.label);
        this.placeholder(this.model.placeholder);

        const variations = await this.styleService.getComponentVariations("formGroup");
        this.appearanceStyles(variations.filter(x => x.category === "appearance"));
        this.appearanceStyle(<string>this.model.styles?.appearance);

        this.appearanceStyle.subscribe(this.applyChanges);
        this.label.subscribe(this.applyChanges);
        this.placeholder.subscribe(this.applyChanges);
    }

    private applyChanges(): void {
        this.model.label = this.label();
        this.model.placeholder = this.placeholder();

        this.model.styles = {
            appearance: this.appearanceStyle()
        };

        this.onChange(this.model);
    }
}