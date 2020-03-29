import * as ko from "knockout";
import template from "./navigationItemSelector.html";
import { NavigationItemViewModel } from "./navigationItemViewModel";
import { NavigationItemContract, INavigationService, NavigationItemModel } from "@paperbits/common/navigation";
import { Component, Event, Param, OnMounted } from "@paperbits/common/ko/decorators";
import { NavigationModelBinder } from "../navigationModelBinder";
import { NavigationViewModelBinder } from "./navigationViewModelBinder";

@Component({
    selector: "navigation-item-selector",
    template: template
})
export class NavigationItemSelector {
    public readonly working: ko.Observable<boolean>;
    public readonly root: ko.Observable<NavigationItemViewModel>;

    constructor(
        private readonly navigationService: INavigationService,
        private readonly navigationModelBinder: NavigationModelBinder,
        private readonly navigationViewModelBinder: NavigationViewModelBinder
    ) {
        // rebinding...
        this.selectNavigationItem = this.selectNavigationItem.bind(this);
        this.selectedNavigationItem = ko.observable<NavigationItemViewModel>();
        this.working = ko.observable(true);
        this.root = ko.observable();

        this.initialize();
    }

    @Param()
    public selectedNavigationItem: ko.Observable<NavigationItemViewModel>;

    @Event()
    public onSelect: (selection: NavigationItemModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.working(true);

        const navigationItems = await this.navigationService.getNavigationItems();

        const lang: NavigationItemContract = {
            key: "@locales",
            label: "Languages"
        };

        navigationItems.push(lang);

        const root: NavigationItemContract = {
            key: null,
            label: "Root",
            navigationItems: navigationItems
        };

        const rootModel = await this.navigationModelBinder.contractToModel(root);
        const rootViewModel = await this.navigationViewModelBinder.modelToViewModel(rootModel);

        this.root(rootViewModel);

        this.working(false);
    }

    public async selectNavigationItem(navigationItem: NavigationItemViewModel): Promise<void> {
        this.selectedNavigationItem(navigationItem);

        if (this.onSelect) {
            const rootModel = this.navigationViewModelBinder.viewModelToModel(navigationItem);
            this.onSelect(rootModel);
        }
    }

    public selectNone(): void {
        if (this.onSelect) {
            this.onSelect(null);
        }
    }
}