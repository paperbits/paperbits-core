import * as ko from "knockout";
import template from "./hyperlinkSelector.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { IHyperlinkProvider } from "@paperbits/common/ui";
import { Component, Event, Param, OnMounted } from "@paperbits/common/ko/decorators";
import { PageSelector, PageItem, AnchorItem } from "../../page/ko";
import { IPageService } from "@paperbits/common/pages";

@Component({
    selector: "hyperlink-selector",
    template: template,
    injectable: "hyperlinkSelector"
})
export class HyperlinkSelector {
    private isValueSelected: boolean;

    public readonly hyperlinkProvider: ko.Observable<IHyperlinkProvider>;
    public readonly selection: ko.Computed<string>;

    @Param()
    public hyperlink: ko.Observable<HyperlinkModel>;

    @Param()
    public targetObject: ko.Observable<any>;

    @Event()
    public onChange: (hyperlink: HyperlinkModel) => void;

    constructor(
        private readonly hyperlinkProviders: IHyperlinkProvider[],
        private readonly pageService: IPageService,
        private readonly pageSelector: PageSelector
    ) {
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkProvider = ko.observable<IHyperlinkProvider>(null);
        this.selection = ko.pureComputed(() => {
            const hyperlink = this.hyperlink();

            return hyperlink
                ? `${hyperlink.title} ${hyperlink.anchorName ? "(" + hyperlink.anchorName + ")" : ""}`
                : "Not selected";
        });
    }

    @OnMounted()
    public onMounted(): void {
        this.updateHyperlinkState(this.hyperlink());
        this.hyperlinkProvider.subscribe(this.onResourcePickerChange);
    }

    private onResourcePickerChange(resourcePicker: IHyperlinkProvider): void {
        if (resourcePicker === null) {
            this.hyperlink(null);
            this.onChange(null);
        }
    }

    public onHyperlinkSelected(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);

        if (this.onChange) {
            this.onChange(hyperlink);
        }
    }

    public setProvider(provider: IHyperlinkProvider): void {
        this.hyperlinkProvider(provider);
    }

    public getCurrentSelection(): string {
        const hyperlink = this.hyperlink();
        return `${this.hyperlinkProvider().name}: ${hyperlink.title} ${hyperlink.anchorName ? "(" + hyperlink.anchorName + ")" : ""}`;
    }

    public clearProvider(): void {
        this.hyperlinkProvider(null);
    }

    private async updateHyperlinkState(hyperlink: HyperlinkModel): Promise<void> {
        if (!hyperlink) {
            this.hyperlinkProvider(null);
            return;
        }

        let hyperlinkProvider: IHyperlinkProvider;

        if (hyperlink.targetKey) {
            hyperlinkProvider = this.hyperlinkProviders.find(x => x.canHandleHyperlink(hyperlink.targetKey));
        }

        if (!hyperlinkProvider) {
            hyperlinkProvider = this.hyperlinkProviders[this.hyperlinkProviders.length - 1];
        } else {
            if (!this.isValueSelected && hyperlinkProvider.componentName === "page-selector") {
                const pageContract = await this.pageService.getPageByKey(hyperlink.targetKey);
                const page = new PageItem(pageContract);
                page.selectedAnchor = new AnchorItem();
                page.selectedAnchor.elementId = hyperlink.anchor;
                this.pageSelector.selectedPage(page);
                await this.pageSelector.selectPage(page);
                this.isValueSelected = true;
            }
        }

        this.hyperlink(hyperlink);
        this.hyperlinkProvider(hyperlinkProvider);
    }
}