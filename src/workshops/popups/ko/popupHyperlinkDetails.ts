import * as ko from "knockout";
import template from "./popupHyperlinkDetails.html";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { ViewManager } from "@paperbits/common/ui";
import { EventManager } from "@paperbits/common/events";


@Component({
    selector: "popup-hyperlink-details",
    template: template
})
export class PopupHyperlinkDetails {
    public readonly target: ko.Observable<string>;
    public readonly triggerEvent: ko.Observable<string>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager,
    ) {
        this.target = ko.observable();
        this.triggerEvent = ko.observable();
    }

    @Param()
    public hyperlink: HyperlinkModel;

    @Event()
    public onHyperlinkChange: (hyperlink: HyperlinkModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.target(this.hyperlink.target);
        this.triggerEvent(this.hyperlink.triggerEvent || "click");

        this.target.subscribe(this.applyChanges);
        this.triggerEvent.subscribe(this.applyChanges);
    }

    public applyChanges(): void {
        this.hyperlink.target = this.target();
        this.hyperlink.triggerEvent = this.triggerEvent();

        if (this.onHyperlinkChange) {
            this.onHyperlinkChange(this.hyperlink);
        }
    }

    public openPopup(): void {
        const hostDocument = this.viewManager.getHostDocument();
        hostDocument.dispatchEvent(new CustomEvent("onPopupRequested", { detail: this.hyperlink.targetKey }));

        this.viewManager.clearContextualCommands();
        this.viewManager.clearJourney();
        this.viewManager.closeView();

        this.eventManager.dispatchEvent("displayHint", {
            key: "4de8",
            content: `You can open a popup anytime by clicking on its trigger holding Ctrl (Windows) or ⌘ (Mac) key.`
        });
    }
}