import * as ko from "knockout";
import template from "./navigationItemSelector.html";
import { NavigationItemViewModel } from "./navigationItemViewModel";
import { NavigationItemContract, INavigationService } from "@paperbits/common/navigation";
import { IResourceSelector } from "@paperbits/common/ui";
import { NavigationTree } from "./navigationTree";
import { Component } from "../../../ko/component";

@Component({
    selector: "navigation-item-selector",
    template: template,
    injectable: "navigationItemSelector"
})
export class NavigationItemSelector implements IResourceSelector<NavigationItemContract> {
    private selectedNavigationItem: KnockoutObservable<NavigationItemViewModel>;

    public navigationItemsTree: KnockoutObservable<NavigationTree>;

    constructor(
        private readonly navigationService: INavigationService,
        public readonly onResourceSelected: (selections: NavigationItemContract) => void
    ) {
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

        if (this.onResourceSelected) {
            this.onResourceSelected(navigationItem.toContract());
        }
    }
}