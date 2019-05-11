import * as ko from "knockout";
import template from "./textStyleSelector.html";
import { IHtmlEditorProvider } from "@paperbits/common/editing";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleService } from "@paperbits/styles";
import { IViewManager } from "@paperbits/common/ui/IViewManager";

@Component({
    selector: "text-style-selector",
    template: template,
    injectable: "textStyleSelector"
})
export class TextStyleSelector {
    public textStyles: ko.ObservableArray<any>;

    constructor(
        private readonly styleService: StyleService,
        private readonly viewManager: IViewManager,
        private readonly htmlEditorProvider: IHtmlEditorProvider
    ) {
        this.textStyles = ko.observableArray<any>();
        this.loadTextStyles();
    }
    
    private async loadTextStyles() {
        const textStyles = await this.styleService.getVariations("globals", "body");
        this.textStyles(textStyles);
    }

    public setTextStyle(item): void {
        const textStyles = this.textStyles();
        let selectedKey = item.key;
        if (item.key === textStyles[0].key) {
            selectedKey = undefined;
        }
        this.htmlEditorProvider.getCurrentHtmlEditor().setTextStyle(selectedKey, this.viewManager.getViewport());
    }
}