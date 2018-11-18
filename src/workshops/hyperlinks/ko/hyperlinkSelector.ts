import * as ko from "knockout";
import template from "./hyperlinkSelector.html";
import { HyperlinkModel, IPermalinkService } from "@paperbits/common/permalinks";
import { IHyperlinkProvider } from "@paperbits/common/ui";
import { Component, Event, Param, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "hyperlink-selector",
    template: template,
    injectable: "hyperlinkSelector"
})
export class HyperlinkSelector {
    public readonly selectedResourcePicker: KnockoutObservable<IHyperlinkProvider>;

    @Param()
    public hyperlink: KnockoutObservable<HyperlinkModel>;

    @Event()
    public onChange: (hyperlink: HyperlinkModel) => void;

    constructor(
        private readonly permalinkService: IPermalinkService,
        private readonly resourcePickers: IHyperlinkProvider[]
    ) {
        // rebinding...
        this.onMounted = this.onMounted.bind(this);
        this.updateHyperlinkState = this.updateHyperlinkState.bind(this);
        this.onResourceSelected = this.onResourceSelected.bind(this);
        this.onResourcePickerChange = this.onResourcePickerChange.bind(this);

        // setting up...
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.selectedResourcePicker = ko.observable<IHyperlinkProvider>(null);
    }

    @OnMounted()
    public onMounted(): void {
        this.updateHyperlinkState(this.hyperlink());
        this.selectedResourcePicker.subscribe(this.onResourcePickerChange);
    }

    private onResourcePickerChange(resourcePicker: IHyperlinkProvider): void {
        if (resourcePicker === null) {
            this.hyperlink(null);
            this.onChange(null);
        }
    }

    /**
     * Called by IResourcePicker when user selected a resource.
     * @param hyperlink 
     */
    public onResourceSelected(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);

        if (this.onChange) {
            this.onChange(hyperlink);
        }
    }

    private async updateHyperlinkState(hyperlink: HyperlinkModel): Promise<void> {
        if (!hyperlink) {
            this.selectedResourcePicker(null);
            this.hyperlink(null);
            return;
        }

        let hyperlinkProvider: IHyperlinkProvider;

        if (hyperlink.permalinkKey) {
            const permalink = await this.permalinkService.getPermalinkByKey(hyperlink.permalinkKey);
            hyperlinkProvider = this.resourcePickers.find(x => x.canHandleHyperlink(permalink));
        }

        if (!hyperlinkProvider) {
            hyperlinkProvider = this.resourcePickers[this.resourcePickers.length - 1];
        }

        this.hyperlink(hyperlink);
        this.selectedResourcePicker(hyperlinkProvider);
    }
}