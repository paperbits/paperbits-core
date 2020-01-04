import * as ko from "knockout";
import template from "./navigationDetails.html";
import { ViewManager } from "@paperbits/common/ui";
import { NavigationItemViewModel } from "./navigationItemViewModel";
import { HyperlinkModel, IPermalinkResolver } from "@paperbits/common/permalinks";
import { Component, Event, OnMounted, Param } from "@paperbits/common/ko/decorators";

@Component({
    selector: "navigation-details-workshop",
    template: template
})
export class NavigationDetailsWorkshop {
    public readonly hyperlinkTitle: ko.Computed<string>;
    public readonly hyperlink: ko.Observable<HyperlinkModel>;

    @Event()
    public onDelete: () => void;

    @Param()
    public navigationItem: NavigationItemViewModel;

    constructor(
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly viewManager: ViewManager
    ) {
        // rebinding...
        this.onMounted = this.onMounted.bind(this);
        this.deleteNavigationItem = this.deleteNavigationItem.bind(this);
        this.onHyperlinkChange = this.onHyperlinkChange.bind(this);

        this.hyperlink = ko.observable<HyperlinkModel>();

        this.hyperlinkTitle = ko.pureComputed<string>(() => {
            const hyperlink = this.hyperlink();

            if (hyperlink) {
                // return `${hyperlink.type}: ${hyperlink.title}`;
                return `${hyperlink.title}`;
            }

            return "Click to select a link...";
        });
    }

    @OnMounted()
    public async onMounted(): Promise<void> {
        if (this.navigationItem.targetKey()) {
            this.init(this.navigationItem.targetKey());
        }
    }

    private async init(targetKey: string): Promise<void> {
        const hyperlink = await this.permalinkResolver.getHyperlinkByTargetKey(targetKey);

        this.hyperlink(hyperlink);
    }

    public onHyperlinkChange(hyperlink: HyperlinkModel): void {
        this.hyperlink(hyperlink);

        const targetKey = hyperlink ? hyperlink.targetKey : null;

        this.navigationItem.targetKey(targetKey);
    }

    public deleteNavigationItem(): void {
        this.navigationItem.remove();
        this.viewManager.notifySuccess("Navigation", `Navigation item "${this.navigationItem.label()}" was deleted.`);
        this.viewManager.closeWorkshop("navigation-details-workshop");

        if (this.onDelete) {
            this.onDelete();
        }
    }
}