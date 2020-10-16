import * as ko from "knockout";
import template from "./dividerEditor.html";
import { StyleService } from "@paperbits/styles";
import { DividerModel } from "../dividerModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";


@Component({
    selector: "divider-editor",
    template: template
})
export class DividerEditor {
    public readonly appearanceStyle: ko.Observable<string>;
    public readonly appearanceStyles: ko.ObservableArray<any>;

    constructor(private readonly styleService: StyleService) {
        this.appearanceStyles = ko.observableArray();
        this.appearanceStyle = ko.observable();
    }

    @Param()
    public model: DividerModel;

    @Event()
    public onChange: (model: DividerModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        if (this.model.styles) {
            const variations = await this.styleService.getComponentVariations("divider");
            this.appearanceStyles(variations.filter(x => x.category === "appearance"));
            this.appearanceStyle(<string>this.model.styles?.appearance);
        }

        this.appearanceStyle.subscribe(this.applyChanges);
    }

    private applyChanges(): void {
        this.model.styles = {
            appearance: this.appearanceStyle()
        };

        this.onChange(this.model);
    }
}