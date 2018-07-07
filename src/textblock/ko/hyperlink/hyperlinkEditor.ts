import * as ko from "knockout";
import template from "./hyperlinkEditor.html";
import { IHtmlEditorProvider } from '@paperbits/common/editing/htmlEditorProvider'
import { IEventManager } from '@paperbits/common/events';
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { HyperlinkContract } from "@paperbits/common/editing";
import { PermalinkResolver } from "@paperbits/common/permalinks/permalinkResolver";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { Component } from "../../../ko/component";

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

        let hyperlinkConfig;

        if (hyperlink.href) {
            hyperlinkConfig = { href: hyperlink.href, target: hyperlink.target };
        }

        if (hyperlink.permalinkKey) {
            let permalink = await this.permalinkService.getPermalinkByKey(hyperlink.permalinkKey);
            hyperlinkConfig = { href: permalink.uri, permalinkKey: hyperlink.permalinkKey, target: hyperlink.target };
        }

        let htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();

        htmlEditor.setHyperlink(hyperlinkConfig);
    }

    private async onSelectionChange(): Promise<void> {
        let htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
        let hyperlinkConfig: HyperlinkContract = htmlEditor.getHyperlink();
        let hyperlink = null;

        if (hyperlinkConfig) {
            hyperlink = await this.permalinkResolver.getHyperlinkFromConfig(hyperlinkConfig);
        }

        this.hyperlink(hyperlink);
    }

    public onClick(): void {
        const htmlEditor = this.htmlEditorProvider.getCurrentHtmlEditor();
        htmlEditor.expandSelection();
    }

    public dispose(): void {
        this.eventManager.removeEventListener("htmlEditorChanged", this.onSelectionChange)
    }
}
