import * as ko from "knockout";
import template from "./navigationItemSelector.html";
import { NavigationItemViewModel } from "./navigationItemViewModel";
import { NavigationItemContract, INavigationService } from "@paperbits/common/navigation";
import { NavigationTree } from "./navigationTree";
import { Component, Event, Param } from "@paperbits/common/ko/decorators";

@Component({
    selector: "navigation-item-selector",
    template: template,
    injectable: "navigationItemSelector"
})
export class NavigationItemSelector {
    public navigationItemsTree: KnockoutObservable<NavigationTree>;

    @Param()
    public selectedNavigationItem: KnockoutObservable<NavigationItemViewModel>;

    @Event()
    public onSelect: (selection: NavigationItemContract) => void;

    constructor(private readonly navigationService: INavigationService) {
        // rebinding...
        this.selectNavigationItem = this.selectNavigationItem.bind(this);
        this.navigationItemsTree = ko.observable<NavigationTree>();
        this.selectedNavigationItem = ko.observable<NavigationItemViewModel>();

        this.searchNavigationItems();
    }

    private async searchNavigationItems(): Promise<void> {
        const navigationItems = await this.navigationService.getNavigationItems();
        const navigationTree = new NavigationTree(navigationItems);

        this.navigationItemsTree(navigationTree);
    }

    public async selectNavigationItem(navigationItem: NavigationItemViewModel): Promise<void> {
        this.selectedNavigationItem(navigationItem);

        if (this.onSelect) {
            this.onSelect(navigationItem.toContract());
        }
    }
}