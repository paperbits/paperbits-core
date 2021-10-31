import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import template from "./formattingTools.html";
import { EventManager } from "@paperbits/common/events";
import { IHtmlEditorProvider, HtmlEditorEvents, alignmentStyleKeys } from "@paperbits/common/editing";
import { Component, OnMounted, OnDestroyed } from "@paperbits/common/ko/decorators";
import { ColorContract } from "@paperbits/styles/contracts";
import { ViewManager } from "@paperbits/common/ui";
import { StyleService } from "@paperbits/styles/styleService";
import { VariationContract } from "@paperbits/common/styles";

@Component({
    selector: "text-block-editor-formatting",
    template: template
})
export class TextBlockEditorFormattingTools {
    public readonly textStyles: ko.ObservableArray<VariationContract>;
    public readonly orderedListStyles: ko.ObservableArray<VariationContract>;
    public readonly unorderedListStyles: ko.ObservableArray<VariationContract>;
    public readonly bold: ko.Observable<boolean>;
    public readonly italic: ko.Observable<boolean>;
    public readonly underlined: ko.Observable<boolean>;
    public readonly highlighted: ko.Observable<boolean>;
    public readonly striked: ko.Observable<boolean>;
    public readonly code: ko.Observable<boolean>;
    public readonly pre: ko.Observable<boolean>;
    public readonly style: ko.Observable<string>;
    public readonly appearance: ko.Observable<string>;
    public readonly colored: ko.Observable<boolean>;
    public readonly selectedColorKey: ko.Observable<string>;
    public readonly alignment: ko.Observable<string>;
    public readonly justified: ko.Observable<boolean>;
    public readonly anchored: ko.Observable<boolean>;
    public readonly size: ko.Observable<string>;
    public readonly sized: ko.Observable<boolean>;
    public readonly olName: ko.Observable<string>;
    public readonly ol: ko.Observable<boolean>;
    public readonly ulName: ko.Observable<string>;
    public readonly ul: ko.Observable<boolean>;
    public readonly font: ko.Observable<string>;

    constructor(
        private readonly htmlEditorProvider: IHtmlEditorProvider,
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly styleService: StyleService
    ) {
        this.style = ko.observable<string>();
        this.appearance = ko.observable<string>();
        this.colored = ko.observable<boolean>();
        this.selectedColorKey = ko.observable<string>();
        this.font = ko.observable<string>();
        this.sized = ko.observable<boolean>();
        this.ol = ko.observable<boolean>();
        this.ul = ko.observable<boolean>();
        this.bold = ko.observable<boolean>();
        this.italic = ko.observable<boolean>();
        this.underlined = ko.observable<boolean>();
        this.highlighted = ko.observable<boolean>();
        this.striked = ko.observable<boolean>();
        this.code = ko.observable<boolean>();
        this.ul = ko.observable<boolean>();
        this.ol = ko.observable<boolean>();
        this.pre = ko.observable<boolean>();
        this.alignment = ko.observable<string>();
        this.anchored = ko.observable<boolean>();

        this.textStyles = ko.observableArray();
        this.orderedListStyles = ko.observableArray();
        this.unorderedListStyles = ko.observableArray();
    }

    @OnMounted()
    public async init(): Promise<void> {
        await this.loadTextStyles();

        this.updateFormattingState();
        this.eventManager.addEventListener(HtmlEditorEvents.onSelectionChange, this.updateFormattingState);
    }

    private async loadTextStyles(): Promise<void> {
        this.textStyles(await this.styleService.getTextVariations());
        this.orderedListStyles(await this.styleService.getVariations("globals", "ol"));
        this.unorderedListStyles(await this.styleService.getVariations("globals", "ul"));
    }

    private updateFormattingState(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        let selectionState = htmlEditor?.getSelectionState();

        if (!selectionState) {
            selectionState = {
                block: "paragraph",
                bold: false,
                italic: false,
                striked: false,
                underlined: false,
                highlighted: false,
                code: false,
                hyperlink: false,
                colorKey: null,
                anchorKey: null,
                orderedList: false,
                bulletedList: false,
                alignment: null,
                appearance: "globals/body/default"
            };
        }

        this.bold(selectionState.bold);
        this.italic(selectionState.italic);
        this.underlined(selectionState.underlined);
        this.highlighted(selectionState.highlighted);
        this.striked(selectionState.striked);
        this.code(selectionState.code);
        this.colored(!!selectionState.colorKey);
        this.selectedColorKey(selectionState.colorKey);
        this.ul(selectionState.bulletedList);
        this.ol(selectionState.orderedList);

        let alignment = "left";

        if (selectionState.alignment) {
            const breakpoint = Utils.getClosestBreakpoint(selectionState.alignment, this.viewManager.getViewport());
            const alignmentStyleKey = selectionState.alignment[breakpoint];

            switch (alignmentStyleKey) {
                case alignmentStyleKeys.left:
                    alignment = "left";
                    break;
                case alignmentStyleKeys.center:
                    alignment = "center";
                    break;
                case alignmentStyleKeys.right:
                    alignment = "right";
                    break;
                case alignmentStyleKeys.justify:
                    alignment = "justify";
                    break;
                default:
                    console.warn(`Unknown alignment style key: ${alignmentStyleKey}`);
            }
        }

        this.alignment(alignment);

        const textStyleKey = selectionState.appearance || "globals/body/default";
        const textStyle = this.textStyles().find(item => item.key === textStyleKey);
        this.appearance(textStyle.displayName);

        this.anchored(!!selectionState.anchorKey);

        switch (selectionState.block) {
            case "heading1":
                this.style("Heading 1");
                break;

            case "heading2":
                this.style("Heading 2");
                break;

            case "heading3":
                this.style("Heading 3");
                break;

            case "heading4":
                this.style("Heading 4");
                break;

            case "heading5":
                this.style("Heading 5");
                break;

            case "heading6":
                this.style("Heading 6");
                break;

            case "quote":
                this.style("Quote");
                break;

            case "formatted":
                this.style("Formatted");
                break;

            default:
                this.style("Normal");
        }

    }

    public toggleNn(): void {
        // htmlEditor.setList(this.intentions.container.list.nested_numbering);
        this.updateFormattingState();
    }

    public toggleBold(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleBold();
    }

    public toggleItalic(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleItalic();
    }

    // public setStyle(intention: Intention): void {
    //     htmlEditor.toggleIntention(intention);
    //     this.updateFormattingState();
    // }

    // public setSize(intention: Intention): void {
    //     htmlEditor.toggleIntention(intention);
    //     this.updateFormattingState();
    // }

    public toggleParagraph(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleParagraph();
    }

    public toggleUnderlined(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleUnderlined();
    }

    public toggleStriked(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleStriked();
    }

    public toggleHighlighted(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleHighlighted();
    }

    public toggleCode(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleCode();
    }

    public toggleSize(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleSize();
    }

    public toggleOrderedList(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleOrderedList();
    }

    public toggleUnorderedList(style: VariationContract): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleUnorderedList(style.key);
    }

    public onUnorderedListStyleSelected(style: VariationContract): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.toggleUnorderedList(style.key);
    }

    public increaseIndentation(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.increaseIndent();

        this.updateFormattingState();
    }

    public decreaseIndentation(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.decreaseIndent();
    }

    public toggleAlignLeft(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.alignLeft(this.viewManager.getViewport());
    }

    public toggleAlignCenter(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.alignCenter(this.viewManager.getViewport());
    }

    public toggleAlignRight(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.alignRight(this.viewManager.getViewport());
    }

    public toggleJustify(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.justify(this.viewManager.getViewport());
    }

    public onColorSelected(color: ColorContract): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        if (color) {
            htmlEditor.setColor(color.key);
        }
        else {
            htmlEditor.removeColor();
        }
    }

    public onTextStyleSelected(style: VariationContract): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }

        htmlEditor.setTextStyle(style.key, this.viewManager.getViewport());
        this.appearance(style.displayName);
    }

    @OnDestroyed()
    public dispose(): void {
        this.eventManager.removeEventListener(HtmlEditorEvents.onSelectionChange, this.updateFormattingState);
    }
}