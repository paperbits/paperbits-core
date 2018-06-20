import template from "./blockStyleSelector.html";
import { IHtmlEditorProvider } from "@paperbits/common/editing";
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "block-style-selector",
    template: template,
    injectable: "blockStyleSelector"
})
export class BlockStyleSelector {
    constructor(
        private readonly htmlEditorProvider: IHtmlEditorProvider
    ) { }

    public resetToNormal(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().resetToNormal();
    }

    public toggleH1(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH1();
    }

    public toggleH2(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH2();
    }

    public toggleH3(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH3();
    }

    public toggleH4(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH4();
    }

    public toggleH5(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH5();
    }

    public toggleH6(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleH6();
    }

    public toggleQuote(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleQuote();
    }

    public toggleCode(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleCode();
    }
}