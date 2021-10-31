import template from "./blockStyleSelector.html";
import { IHtmlEditorProvider } from "@paperbits/common/editing";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "block-style-selector",
    template: template
})
export class BlockStyleSelector {
    constructor(private readonly htmlEditorProvider: IHtmlEditorProvider) { }

    public resetToNormal(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleParagraph();
    }

    public toggleH1(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleH1();
    }

    public toggleH2(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleH2();
    }

    public toggleH3(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleH3();
    }

    public toggleH4(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleH4();
    }

    public toggleH5(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleH5();
    }

    public toggleH6(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleH6();
    }

    public toggleQuote(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleQuote();
    }

    public toggleFormatted(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleFormatted();
    }
}