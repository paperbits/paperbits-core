import * as ko from "knockout";
import template from "./hyperlinkSelector.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { IHyperlinkProvider } from "@paperbits/common/ui";
import { Component, Event, Param, OnMounted } from "@paperbits/common/ko/decorators";

const defaultTarget = "_self";

@Component({
    selector: "hyperlink-selector",
    template: template,
    injectable: "hyperlinkSelector"
})
export class HyperlinkSelector {
    public readonly hyperlinkProvider: ko.Observable<IHyperlinkProvider>;
    public readonly target: ko.Observable<string>;

    @Param()
    public hyperlink: ko.Observable<HyperlinkModel>;

    @Event()
    public onChange: (hyperlink: HyperlinkModel) => void;

    constructor(
        private readonly hyperlinkProviders: IHyperlinkProvider[]
    ) {
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkProvider = ko.observable<IHyperlinkProvider>(null);
        this.target = ko.observable<string>(defaultTarget);
    }

    @OnMounted()
    public onMounted(): void {
        this.updateHyperlinkState(this.hyperlink());
        this.hyperlinkProvider.subscribe(this.onResourcePickerChange);
        this.target.subscribe(this.targetChanged);
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

    public selectProvider(provider: IHyperlinkProvider): void {
        this.hyperlinkProvider(provider);

        if (!provider) {
            this.hyperlink(null);
        }
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
            return;
        }

        let hyperlinkProvider: IHyperlinkProvider;

        if (hyperlink.targetKey) {
            hyperlinkProvider = this.hyperlinkProviders.find(x => x.canHandleHyperlink(hyperlink.targetKey));
        }

        if (!hyperlinkProvider) {
            hyperlinkProvider = this.hyperlinkProviders[this.hyperlinkProviders.length - 1];
        }

        this.hyperlink(hyperlink);
        this.target(hyperlink.target || defaultTarget);
        this.hyperlinkProvider(hyperlinkProvider);
    }
}