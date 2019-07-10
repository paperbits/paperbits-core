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
    public readonly targets: ko.ObservableArray<{ name: string, value: string }>;
    public readonly target: ko.Observable<string>;

    @Param()
    public hyperlink: ko.Observable<HyperlinkModel>;

    @Event()
    public onChange: (hyperlink: HyperlinkModel) => void;

    private targetsValues: { name: string, value: string }[] = [
        { name: "Current window", value: "_self" },
        { name: "New window", value: "_blank" }
    ];

    constructor(
        private readonly hyperlinkProviders: IHyperlinkProvider[],
        private readonly pageService: IPageService,
        private readonly pageSelector: PageSelector
    ) {
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkProvider = ko.observable<IHyperlinkProvider>(null);
        this.targets = ko.observableArray<{ name: string, value: string }>(this.targetsValues);
        this.target = ko.observable<string>();
    }

    @OnMounted()
    public onMounted(): void {
        this.setTarget(this.hyperlink());
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
        hyperlink.target = this.target();

        if (this.onChange) {
            this.onChange(hyperlink);
        }
    }

    public targetChanged(): void {
        const hyperlink = this.hyperlink();
        hyperlink.target = this.target();
        this.hyperlink(hyperlink);

        if (this.onChange) {
            this.onChange(hyperlink);
        }
    }

    public setProvider(provider: IHyperlinkProvider): void {
        this.hyperlinkProvider(provider);
        this.hyperlink(null);
        this.target(this.targetsValues[0].value);
    }

    public getCurrentSelection(): string {
        const hyperlink = this.hyperlink();
        if (!this.hyperlinkProvider() || !hyperlink) {
            return "Not selected";
        }
        return `${this.hyperlinkProvider().name}: ${hyperlink.title} ${hyperlink.anchorName ? "(" + hyperlink.anchorName + ")" : ""}`;
    }

    public clearProvider(): void {
        this.hyperlinkProvider(null);
    }

    private async updateHyperlinkState(hyperlink: HyperlinkModel): Promise<void> {
        if (!hyperlink) {
            this.hyperlinkProvider(null);
            this.target(this.targetsValues[0].value);
            return;
        }

        let hyperlinkProvider: IHyperlinkProvider;

        if (hyperlink.targetKey) {
            hyperlinkProvider = this.hyperlinkProviders.find(x => x.canHandleHyperlink(hyperlink.targetKey));
        }

        if (!hyperlinkProvider) {
            hyperlinkProvider = this.hyperlinkProviders[this.hyperlinkProviders.length - 1];
        }
        else if (this.isValueSelected && hyperlinkProvider.componentName === "page-selector") {
            const pageContract = await this.pageService.getPageByKey(hyperlink.targetKey);
            const page = new PageItem(pageContract);

            page.selectedAnchor = new AnchorItem();
            page.selectedAnchor.elementId = hyperlink.anchor;

            this.pageSelector.selectedPage(page);

            await this.pageSelector.selectPage(page);

            this.isValueSelected = true;
        }

        this.hyperlink(hyperlink);
        this.setTarget(hyperlink);
        this.hyperlinkProvider(hyperlinkProvider);
    }

    private setTarget(hyperlink: HyperlinkModel): void {
        this.target(hyperlink.target || "_self");
    }
}