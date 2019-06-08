import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import template from "./formattingTools.html";
import { IEventManager } from "@paperbits/common/events";
import { IHtmlEditorProvider, HtmlEditorEvents, alignmentStyleKeys } from "@paperbits/common/editing";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { FontContract, ColorContract } from "@paperbits/styles/contracts";
import { IViewManager } from "@paperbits/common/ui";
import { StyleService } from "@paperbits/styles/styleService";

@Component({
    selector: "formatting",
    template: template,
    injectable: "formattingTools"
})
export class FormattingTools {
    private textStyles: {}[];

    public readonly bold: ko.Observable<boolean>;
    public readonly italic: ko.Observable<boolean>;
    public readonly underlined: ko.Observable<boolean>;
    public readonly highlighted: ko.Observable<boolean>;
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
        private readonly eventManager: IEventManager,
        private readonly viewManager: IViewManager,
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
        this.ul = ko.observable<boolean>();
        this.ol = ko.observable<boolean>();
        this.pre = ko.observable<boolean>();
        this.alignment = ko.observable<string>();
        this.anchored = ko.observable<boolean>();
    }

    @OnMounted()
    public async init(): Promise<void> {
        await this.loadTextStyles();
        this.updateFormattingState();
        this.eventManager.addEventListener(HtmlEditorEvents.onSelectionChange, this.updateFormattingState);
    }

    private async loadTextStyles(): Promise<void> {
        this.textStyles = await this.styleService.getVariations("globals", "body");
    }

    private updateFormattingState(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!htmlEditor) {
            return;
        }
        
        const selectionState = htmlEditor.getSelectionState();

        this.bold(selectionState.bold);
        this.italic(selectionState.italic);
        this.underlined(selectionState.underlined);
        this.highlighted(selectionState.highlighted);
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
        if (this.textStyles) {
            let appearance = this.textStyles[0]["displayName"];
            
            if (selectionState.appearance) {
                // const breakpoint = Utils.getClosestBreakpoint(selectionState.appearance, this.viewManager.getViewport());
                // const styleKey = selectionState.appearance[breakpoint];
                const styleKey = selectionState.appearance;

                const textStyle = this.textStyles.find(item => item["key"] === styleKey);
                appearance = textStyle && textStyle["displayName"];
            }

            this.appearance(appearance);
        }

        

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
        // this.htmlEditorProvider.getCurrentHtmlEditor().setList(this.intentions.container.list.nested_numbering);
        this.updateFormattingState();
    }

    public toggleBold(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleBold();
    }

    public toggleItalic(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleItalic();
    }

    // public setStyle(intention: Intention): void {
    //     this.htmlEditorProvider.getCurrentHtmlEditor().toggleIntention(intention);
    //     this.updateFormattingState();
    // }

    // public setSize(intention: Intention): void {
    //     this.htmlEditorProvider.getCurrentHtmlEditor().toggleIntention(intention);
    //     this.updateFormattingState();
    // }

    public toggleParagraph(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleParagraph();
    }

    public toggleUnderlined(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleUnderlined();
    }

    public toggleHighlighted(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleHighlighted();
    }

    public toggleSize(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleSize();
    }

    public toggleOrderedList(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleOrderedList();
    }

    public toggleUnorderedList(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleUnorderedList();
    }

    public incIndent(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().increaseIndent();

        this.updateFormattingState();
    }
    public decIndent(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().decreaseIndent();
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

    public toggleFormatted(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleFormatted();
    }

    public toggleAlignLeft(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().alignLeft(this.viewManager.getViewport());
    }

    public toggleAlignCenter(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().alignCenter(this.viewManager.getViewport());
    }

    public toggleAlignRight(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().alignRight(this.viewManager.getViewport());
    }

    public toggleJustify(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().justify(this.viewManager.getViewport());
    }

    public resetToNormal(): void {
        this.htmlEditorProvider.getCurrentHtmlEditor().toggleParagraph();
    }

    public onColorSelected(color: ColorContract): void {
        if (color) {
            this.htmlEditorProvider.getCurrentHtmlEditor().setColor(color.key);
        }
        else {
            this.htmlEditorProvider.getCurrentHtmlEditor().removeColor();
        }
    }

    public dispose(): void {
        this.eventManager.removeEventListener(HtmlEditorEvents.onSelectionChange, this.updateFormattingState);
    }
}