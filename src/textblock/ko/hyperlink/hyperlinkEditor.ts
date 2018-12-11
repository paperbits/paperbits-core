import * as ko from "knockout";
import template from "./hyperlinkEditor.html";
import { IHtmlEditorProvider } from "@paperbits/common/editing/htmlEditorProvider";
import { IEventManager } from "@paperbits/common/events";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { HyperlinkContract } from "@paperbits/common/editing";
import { PermalinkResolver } from "@paperbits/common/permalinks/permalinkResolver";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "hyperlink-editor",
    template: template,
    injectable: "hyperlinkEditor"
})
export class HyperlinkEditor {
    private readonly htmlEditorProvider: IHtmlEditorProvider;
    private readonly permalinkResolver: PermalinkResolver;
    private readonly permalinkService: IPermalinkService;
    private readonly eventManager: IEventManager;

    public readonly hyperlink: KnockoutObservable<HyperlinkModel>;

    constructor(htmlEditorProvider: IHtmlEditorProvider, permalinkResolver: PermalinkResolver, permalinkService: IPermalinkService, eventManager: IEventManager) {
        this.htmlEditorProvider = htmlEditorProvider;
        this.permalinkResolver = permalinkResolver;
        this.permalinkService = permalinkService;
        this.eventManager = eventManager;

        this.onSelectionChange = this.onSelectionChange.bind(this);
        this.onHyperlinkChange = this.onHyperlinkChange.bind(this);

        this.hyperlink = ko.observable<HyperlinkModel>();

        eventManager.addEventListener("htmlEditorChanged", this.onSelectionChange);
    }

    public async onHyperlinkChange(hyperlink: HyperlinkModel): Promise<void> {
        if (!hyperlink) {
            this.htmlEditorProvider.getCurrentHtmlEditor().removeHyperlink();
            return;
        }

        if (hyperlink.permalinkKey) {
            const permalink = await this.permalinkService.getPermalinkByKey(hyperlink.permalinkKey);
            hyperlink.href = permalink.uri;

            const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
            htmlEditor.setHyperlink(hyperlink);
        }
    }

    private async onSelectionChange(): Promise<void> {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
        let hyperlink = htmlEditor.getHyperlink();

        if (hyperlink) {
            hyperlink = await this.permalinkResolver.getHyperlinkByPermalinkKey(hyperlink.permalinkKey);
        }

        this.hyperlink(hyperlink);
    }

    public onClick(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
        htmlEditor.expandSelection();
    }

    public dispose(): void {
        this.eventManager.removeEventListener("htmlEditorChanged", this.onSelectionChange);
    }
}
