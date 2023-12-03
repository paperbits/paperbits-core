import * as ko from "knockout";
import template from "./hyperlinkInput.html";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { Component, Event, Param, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "input-hyperlink",
    template: template
})
export class HyperlinkInput {
    private selectedHyperlink: ko.Observable<HyperlinkModel>;

    public hyperlinkTitle: ko.Computed<string>;

    constructor() {
        this.hyperlink = ko.observable();
        this.selectedHyperlink = ko.observable();
        this.hyperlinkTitle = ko.pureComputed<string>(() => {
            const hyperlink = this.selectedHyperlink();

            if (hyperlink) {
                return `${hyperlink.title}`;
            }

            return "Click to select a link...";
        });
    }

    @Param()
    public hyperlink: ko.Observable<HyperlinkModel>;

    @Event()
    public onChange: (hyperlink: HyperlinkModel) => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        this.selectedHyperlink(this.hyperlink());
        this.hyperlink.subscribe(hyperlink => this.selectedHyperlink(hyperlink));
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        this.selectedHyperlink(hyperlink);

        if (this.onChange) {
            this.onChange(hyperlink)
        }
    }
}
