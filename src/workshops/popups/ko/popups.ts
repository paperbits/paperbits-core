import * as ko from "knockout";
import template from "./popups.html";
import { IPopupService, PopupContract } from "@paperbits/common/popups";
import { ViewManager, View } from "@paperbits/common/ui";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Query, Operator, Page } from "@paperbits/common/persistence";
import { PopupItem } from "./popupItem";


@Component({
    selector: "popups",
    template: template
})
export class PopupsWorkshop {
    private currentPopupOfResults: Page<PopupContract>;
    private activePopupPermalink: string;
    public readonly searchPattern: ko.Observable<string>;
    public readonly popups: ko.ObservableArray<PopupItem>;
    public readonly working: ko.Observable<boolean>;
    public readonly selectedPopup: ko.Observable<PopupItem>;

    constructor(
        private readonly popupService: IPopupService,
        private readonly viewManager: ViewManager
    ) {
        this.popups = ko.observableArray<PopupItem>();
        this.selectedPopup = ko.observable<PopupItem>();
        this.searchPattern = ko.observable<string>("");
        this.working = ko.observable(false);
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.searchPopups();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchPopups);
    }

    public async searchPopups(searchPattern: string = ""): Promise<void> {
        this.popups([]);

        const query = Query
            .from<PopupContract>()
            .orderBy(`title`);

        if (searchPattern) {
            query.where(`title`, Operator.contains, searchPattern);
        }


        this.working(true);
        this.currentPopupOfResults = await this.popupService.search(query);
        this.addPopupOfResults(this.currentPopupOfResults);
        this.working(false);
    }

    private addPopupOfResults(popupOfResult: Page<PopupContract>): void {
        const popupItems = popupOfResult.value.map(popup => {
            const popupItem = new PopupItem(popup);

            if (popup.permalink === this.activePopupPermalink) {
                this.selectedPopup(popupItem);
            }

            return popupItem;
        });

        this.popups.push(...popupItems);
    }

    public async loadNextPopup(): Promise<void> {
        if (!this.currentPopupOfResults?.takeNext) {
            return;
        }

        this.working(true);
        this.currentPopupOfResults = await this.currentPopupOfResults.takeNext();
        this.addPopupOfResults(this.currentPopupOfResults);
        this.working(false);
    }

    public selectPopup(popupItem: PopupItem): void {
        this.selectedPopup(popupItem);

        const view: View = {
            heading: "Popup details",
            // returnFocusTo: ???
            component: {
                name: "popup-details-workshop",
                params: {
                    popupItem: popupItem,
                    onDeleteCallback: () => {
                        this.searchPopups();
                    },
                    onCopyCallback: async (item: PopupItem) => {
                        await this.searchPopups();
                        this.selectPopup(item);
                    }
                }
            }
        };

        this.viewManager.openViewAsWorkshop(view);
    }

    public async addPopup(): Promise<void> {
        this.working(true);


        const popupContract = await this.popupService.createPopup("New popup", "");
        const popupItem = new PopupItem(popupContract);

        this.popups.push(popupItem);
        this.selectPopup(popupItem);

        this.working(false);
    }

    public isSelected(popup: PopupItem): boolean {
        const selectedPopup = this.selectedPopup();
        return selectedPopup?.key === popup.key;
    }
}