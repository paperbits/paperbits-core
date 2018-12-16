import * as ko from "knockout";
import template from "./hyperlinkSelector.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { IHyperlinkProvider } from "@paperbits/common/ui";
import { Component, Event, Param, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "hyperlink-selector",
    template: template,
    injectable: "hyperlinkSelector"
})
export class HyperlinkSelector {
    public readonly hyperlinkProvider: KnockoutObservable<IHyperlinkProvider>;

    @Param()
    public hyperlink: KnockoutObservable<HyperlinkModel>;

    @Event()
    public onChange: (hyperlink: HyperlinkModel) => void;

    constructor(
        private readonly resourcePickers: IHyperlinkProvider[]
    ) {
        // rebinding...
        this.onMounted = this.onMounted.bind(this);
        this.updateHyperlinkState = this.updateHyperlinkState.bind(this);
        this.onHyperlinkSelected = this.onHyperlinkSelected.bind(this);
        this.onResourcePickerChange = this.onResourcePickerChange.bind(this);

        // setting up...
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkProvider = ko.observable<IHyperlinkProvider>(null);
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

    private async updateHyperlinkState(hyperlink: HyperlinkModel): Promise<void> {
        if (!hyperlink) {
            this.hyperlinkProvider(null);
            this.hyperlink(null);
            return;
        }

        let hyperlinkProvider: IHyperlinkProvider;

        if (hyperlink.targetKey) {
            hyperlinkProvider = this.resourcePickers.find(x => x.canHandleHyperlink(hyperlink.targetKey));
        }

        if (!hyperlinkProvider) {
            hyperlinkProvider = this.resourcePickers[this.resourcePickers.length - 1];
        }

        this.hyperlink(hyperlink);
        this.hyperlinkProvider(hyperlinkProvider);
    }
}