import * as ko from "knockout";
import template from "./hyperlinkSelector.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { IHyperlinkProvider } from "@paperbits/common/ui";
import { Component, Event, Param, OnMounted } from "@paperbits/common/ko/decorators";

const defaultTarget = "_self";

@Component({
    selector: "hyperlink-selector",
    template: template
})
export class HyperlinkSelector {
    public readonly hyperlinkProvider: ko.Observable<IHyperlinkProvider>;
    public readonly target: ko.Observable<string>;
    public readonly selection: ko.Computed<string>;

    @Param()
    public hyperlink: ko.Observable<HyperlinkModel>;

    @Event()
    public onChange: (hyperlink: HyperlinkModel) => void;

    constructor(private readonly hyperlinkProviders: IHyperlinkProvider[]) {
        this.hyperlink = ko.observable<HyperlinkModel>();
        this.hyperlinkProvider = ko.observable<IHyperlinkProvider>(null);
        this.target = ko.observable<string>(defaultTarget);
        this.selection = ko.computed(() => {
            const hyperlink = ko.unwrap(this.hyperlink);

            if (!hyperlink) {
                return "No link";
            }

            return `${hyperlink.title}${hyperlink.anchorName ? " (" + hyperlink.anchorName + ")" : ""}`;
        });
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

        if (hyperlink) {
            hyperlink.target = this.target();
            const hyperlinkProvider = this.hyperlinkProviders.find(x => x.canHandleHyperlink(hyperlink.targetKey));
            this.hyperlinkProvider(hyperlinkProvider);
        }

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

        this.hyperlink(hyperlink);
        this.target(hyperlink.target || defaultTarget);
        this.hyperlinkProvider(hyperlinkProvider);
    }
}