import * as ko from "knockout";
import template from "./popupSelector.html";
import { PopupItem } from "./popupItem";
import { IPopupService, PopupContract } from "@paperbits/common/popups";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Query, Operator, Page } from "@paperbits/common/persistence";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { EventManager } from "@paperbits/common/events";

@Component({
    selector: "popup-selector",
    template: template
})
export class PopupSelector {
    private currentPage: Page<PopupContract>;
    public readonly searchPattern: ko.Observable<string>;
    public readonly popups: ko.ObservableArray<PopupItem>;
    public readonly title: ko.Observable<string>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedPopup: ko.Observable<PopupItem>;

    constructor(
        private readonly popupService: IPopupService,
        private readonly eventManager: EventManager
    ) {
        this.title = ko.observable<string>("New popup");
        this.popups = ko.observableArray();
        this.selectedPopup = ko.observable();
        this.searchPattern = ko.observable();
        this.working = ko.observable(false);
    }

    @Event()
    public onSelect: (selection: PopupContract) => void;

    @Event()
    public onHyperlinkSelect: (selection: HyperlinkModel) => void;

    @OnMounted()
    public async onMounted(): Promise<void> {
        await this.searchPopups();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchPopups);
    }

    public async searchPopups(searchPattern: string = ""): Promise<void> {
        this.working(true);
        this.popups([]);

        const query = Query
            .from<PopupContract>()
            .orderBy(`title`);

        if (searchPattern) {
            query.where(`title`, Operator.contains, searchPattern);
        }

        const pageOfResults = await this.popupService.search(query);
        this.currentPage = pageOfResults;

        const popupItems = pageOfResults.value.map(media => new PopupItem(media));
        this.popups.push(...popupItems);

        this.working(false);
    }

    public async loadNextPage(): Promise<void> {
        if (!this.currentPage?.takeNext || this.working()) {
            return;
        }

        this.working(true);

        this.currentPage = await this.currentPage.takeNext();

        const popupItems = this.currentPage.value.map(page => new PopupItem(page));
        this.popups.push(...popupItems);

        this.working(false);
    }

    public selectPopup(popupItem: PopupItem): void {
        const uri = this.selectedPopup();

        if (uri) {
            uri.hasFocus(false);
        }

        popupItem.hasFocus(true);
        this.selectedPopup(popupItem);

        if (this.onSelect) {
            this.onSelect(popupItem.toContract());
        }

        if (this.onHyperlinkSelect) {
            this.onHyperlinkSelect(popupItem.getHyperlink());
        }
    }

    public async createPopup(): Promise<void> {
        const popupContract = await this.popupService.createPopup(this.title());
        const popupItem = new PopupItem(popupContract);

        if (this.onHyperlinkSelect) {
            this.onHyperlinkSelect(popupItem.getHyperlink());
        }

        this.eventManager.dispatchEvent("onPopupCreate", popupContract.key);

        this.searchPopups();
    }

    public async deletePopup(): Promise<void> {
        const uri = this.selectedPopup();

        if (uri) {
            await this.popupService.deletePopup(uri.toContract());
        }
        
        await this.searchPopups();
    }
}