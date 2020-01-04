import * as ko from "knockout";
import * as _ from "lodash";
import template from "./textStyleSelector.html";
import { IHtmlEditorProvider } from "@paperbits/common/editing";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { StyleService } from "@paperbits/styles";
import { ViewManager } from "@paperbits/common/ui/viewManager";

@Component({
    selector: "text-style-selector",
    template: template
})
export class TextStyleSelector {
    public textStyles: ko.ObservableArray<any>;

    constructor(
        private readonly styleService: StyleService,
        private readonly viewManager: ViewManager,
        private readonly htmlEditorProvider: IHtmlEditorProvider
    ) {
        this.textStyles = ko.observableArray<any>();
    }
    
    @OnMounted()
    public async initiallize(): Promise<void> {
        const textStyles = await this.styleService.getVariations("globals", "body");
        this.textStyles(_.sortBy(textStyles, ["displayName"]));
    }

    public setTextStyle(style: any): void {
        let selectedKey = style.key;

        if (selectedKey.split("/").pop() === "default") {
            selectedKey = undefined;
        }
        
        this.htmlEditorProvider.getCurrentHtmlEditor().setTextStyle(selectedKey, this.viewManager.getViewport());
    }
}