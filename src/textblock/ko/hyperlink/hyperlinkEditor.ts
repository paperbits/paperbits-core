import * as ko from "knockout";
import template from "./hyperlinkEditor.html";
import { IHtmlEditorProvider } from "@paperbits/common/editing/htmlEditorProvider";
import { EventManager } from "@paperbits/common/events";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { PermalinkResolver } from "@paperbits/common/permalinks/permalinkResolver";
import { Component, OnDestroyed } from "@paperbits/common/ko/decorators";

@Component({
    selector: "hyperlink-editor",
    template: template,
    injectable: "hyperlinkEditor"
})
export class HyperlinkEditor {
    public readonly hyperlink: ko.Observable<HyperlinkModel>;

    constructor(
        private readonly htmlEditorProvider: IHtmlEditorProvider,
        private readonly permalinkResolver: PermalinkResolver,
        private readonly eventManager: EventManager
    ) {
        this.htmlEditorProvider = htmlEditorProvider;
        this.permalinkResolver = permalinkResolver;
        this.eventManager = eventManager;

        this.onSelectionChange = this.onSelectionChange.bind(this);
        this.onHyperlinkChange = this.onHyperlinkChange.bind(this);

        this.hyperlink = ko.observable<HyperlinkModel>();

        eventManager.addEventListener("htmlEditorChanged", this.onSelectionChange);
    }

    public async onHyperlinkChange(hyperlink: HyperlinkModel): Promise<void> {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        if (!hyperlink) {
            htmlEditor.removeHyperlink();
        } else {
            htmlEditor.setHyperlink(hyperlink);
        }        
    }

    private async onSelectionChange(): Promise<void> {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
        let hyperlink = htmlEditor.getHyperlink();

        if (hyperlink) {
            const newLink = await this.permalinkResolver.getHyperlinkByTargetKey(hyperlink.targetKey);
            hyperlink = {...hyperlink, ...newLink};
        }

        this.hyperlink(hyperlink);
    }

    public onClick(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
        htmlEditor.expandSelection();
    }

    @OnDestroyed()
    public dispose(): void {
        this.eventManager.removeEventListener("htmlEditorChanged", this.onSelectionChange);
    }
}
