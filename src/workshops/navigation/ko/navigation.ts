import * as ko from "knockout";
import template from "./navigation.html";
import { INavigationService } from "@paperbits/common/navigation/INavigationService";
import { IViewManager } from "@paperbits/common/ui";
import { NavigationItemContract } from "@paperbits/common/navigation/navigationItemContract";
import { NavigationTree } from "./navigationTree";
import { NavigationItemViewModel } from "./navigationItemViewModel";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "navigation",
    template: template,
    injectable: "navigationWorkshop"
})
export class NavigationWorkshop {
    private selectedNavigationItem: ko.Observable<NavigationItemViewModel>;

    public readonly navigationItemsTree: ko.Observable<NavigationTree>;
    public readonly working: ko.Observable<boolean>;

    constructor(
        private readonly navigationService: INavigationService,
        private readonly viewManager: IViewManager
    ) {
        // rebinding...
        this.onNavigationUpdate = this.onNavigationUpdate.bind(this);
        this.selectNavigationItem = this.selectNavigationItem.bind(this);
        this.navigationItemsTree = ko.observable<NavigationTree>();
        this.selectedNavigationItem = ko.observable<NavigationItemViewModel>();
        this.working = ko.observable(true);
    }

    @OnMounted()
    public async searchNavigationItems(): Promise<void> {
        this.working(true);
        const navigationItems = await this.navigationService.getNavigationItems();
        const navigationTree = new NavigationTree(navigationItems);
        this.navigationItemsTree(navigationTree);
        this.working(false);

        navigationTree.onUpdate.subscribe(this.onNavigationUpdate);
    }

    public async onNavigationUpdate(navigationItems: NavigationItemContract[]): Promise<void> {
        await this.navigationService.updateNavigation(navigationItems);
    }

    public addNavigationItem(): void {
        const newNode = this.navigationItemsTree().addNode("< New >");

        this.selectNavigationItem(newNode);
    }

    public isNodeSelected(): boolean {
        return !!(this.navigationItemsTree() && this.navigationItemsTree().focusedNode());
    }

    public async selectNavigationItem(navigationItem: NavigationItemViewModel): Promise<void> {
        this.selectedNavigationItem(navigationItem);

        this.viewManager.openViewAsWorkshop("Navigation item", "navigation-details-workshop", {
            navigationItem: navigationItem,
            onDeleteCallback: (isRootItem: boolean) => {
                if (isRootItem) {
                    this.navigationItemsTree().removeRootNode(navigationItem);
                    this.viewManager.notifySuccess("Navigation", `Navigation item "${navigationItem.label()}" was deleted.`);
                    this.viewManager.closeWorkshop("navigation-details-workshop");
                }
                this.searchNavigationItems();
            }
        });
    }
}
