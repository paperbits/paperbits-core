import * as ko from "knockout";
import template from "./navigationDetails.html";
import { IViewManager } from "@paperbits/common/ui/IViewManager";
import { NavigationItemViewModel } from "./navigationItemViewModel";
import { HyperlinkModel } from "@paperbits/common/permalinks";
import { IPermalinkResolver } from "@paperbits/common/permalinks/IPermalinkResolver";
import { Component } from "../../../ko/component";

@Component({
    selector: "navigation-details-workshop",
    template: template,
    injectable: "navigationDetailsWorkshop"
})
export class NavigationDetailsWorkshop {
    private readonly onDeleteCallback: () => void;

    public readonly hyperlinkTitle: KnockoutComputed<string>;
    public readonly hyperlink: KnockoutObservable<HyperlinkModel>;
    public readonly navigationItem: NavigationItemViewModel;

    constructor(
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly viewManager: IViewManager,
        params
    ) {

        // initialization...
        this.navigationItem = params.navigationItem;
        this.onDeleteCallback = params.onDeleteCallback;

        // rebinding...
        this.deleteNavigationItem = this.deleteNavigationItem.bind(this);
        this.onHyperlinkChange = this.onHyperlinkChange.bind(this);

        this.hyperlink = ko.observable<HyperlinkModel>();

        this.hyperlinkTitle = ko.pureComputed<string>(() => {
            const hyperlink = this.hyperlink();

            if (hyperlink) {
                //return `${hyperlink.type}: ${hyperlink.title}`;
                return `${hyperlink.title}`;
            }

            return "Click to select a link...";
        });

        if (this.navigationItem.permalinkKey()) {
            this.init(this.navigationItem.permalinkKey());
        }
    }

    private async init(permalinkKey: string): Promise<void> {
        const hyperlink = await this.permalinkResolver.getHyperlinkByPermalinkKey(permalinkKey);

        this.hyperlink(hyperlink);
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);
        this.navigationItem.permalinkKey(hyperlink.permalinkKey);
    }

    public deleteNavigationItem(): void {
        this.navigationItem.remove();

        this.viewManager.notifySuccess("Navigation", `Navigation item "${this.navigationItem.label()}" was deleted.`);
        this.viewManager.closeWorkshop("navigation-details-workshop");

        if (this.onDeleteCallback) {
            this.onDeleteCallback()
        }
    }
}