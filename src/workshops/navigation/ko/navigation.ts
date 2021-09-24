import * as ko from "knockout";
import template from "./navigation.html";
import { INavigationService, NavigationEvents } from "@paperbits/common/navigation";
import { ViewManager, View } from "@paperbits/common/ui";
import { NavigationItemContract } from "@paperbits/common/navigation/navigationItemContract";
import { NavigationItemViewModel } from "./navigationItemViewModel";
import { Component, OnMounted, OnDestroyed } from "@paperbits/common/ko/decorators";
import { NavigationModelBinder } from "../navigationModelBinder";
import { NavigationViewModelBinder } from "./navigationViewModelBinder";
import { EventManager, Events } from "@paperbits/common/events";


@Component({
    selector: "navigation",
    template: template
})
export class NavigationWorkshop {
    public readonly selection: ko.Observable<NavigationItemViewModel>;
    public readonly root: ko.Observable<NavigationItemViewModel>;
    public readonly working: ko.Observable<boolean>;

    private placeholderElement: HTMLElement;

    constructor(
        private readonly navigationService: INavigationService,
        private readonly viewManager: ViewManager,
        private readonly navigationModelBinder: NavigationModelBinder,
        private readonly navigationViewModelBinder: NavigationViewModelBinder,
        private readonly eventManager: EventManager
    ) {
        // rebinding...
        this.onNavigationUpdate = this.onNavigationUpdate.bind(this);
        this.selectNavigationItem = this.selectNavigationItem.bind(this);
        this.selection = ko.observable<NavigationItemViewModel>();
        this.working = ko.observable(true);

        this.root = ko.observable();

        this.placeholderElement = document.createElement("div");
        this.placeholderElement.className = "placeholder";
        this.placeholderElement.onmousemove = this.onNullPointerMove;

        document.addEventListener(Events.KeyDown, this.onKeyDown.bind(this), false);
    }

    @OnMounted()
    public async searchNavigationItems(): Promise<void> {
        this.working(true);

        const navigationItems = await this.navigationService.getNavigationItems();

        const root: NavigationItemContract = {
            key: null,
            label: "",
            navigationItems: navigationItems
        };

        const rootModel = await this.navigationModelBinder.contractToModel(root);
        const rootViewModel = await this.navigationViewModelBinder.modelToViewModel(rootModel);

        this.root(rootViewModel);
        this.working(false);

        rootViewModel.onUpdate.subscribe(this.onNavigationUpdate);

        this.eventManager.dispatchEvent("displayHint", {
            key: "b300",
            content: `You can manage the navigation structure of the entire website in one place. Specific nodes of this structure can be assigned to navigation widgets like a Menu.`
        });
    }

    public async onNavigationUpdate(): Promise<void> {
        const rootModel = this.navigationViewModelBinder.viewModelToModel(this.root());
        const rootContract = this.navigationModelBinder.modelToContract(rootModel);
        
        await this.navigationService.updateNavigation(rootContract.navigationItems);

        rootModel.nodes.forEach(navigationItem => {
            this.eventManager.dispatchEvent(NavigationEvents.onNavigationItemUpdate, navigationItem);
        });
    }

    public addNavigationItem(): void {
        const currentNode = this.selection() || this.root();
        const node = currentNode.addChild();

        this.selectNavigationItem(node);
    }

    public async selectNavigationItem(navigationItem: NavigationItemViewModel): Promise<void> {
        this.selection(navigationItem);

        const view: View = {
            heading: "Navigation item",
            component: {
                name: "navigation-details-workshop",
                params: {
                    navigationItem: navigationItem,
                    onDelete: () => {
                        this.selection(navigationItem.parent);
                    }
                }
            }
        };

        this.viewManager.openViewAsWorkshop(view);
    }

    private onNullPointerMove(event: MouseEvent): void {
        event.stopPropagation();
    }

    public onNodeDragStart(sourceData: any, node: HTMLElement): void {
        const width = node.clientWidth + "px";
        const height = node.clientHeight + "px";

        this.placeholderElement.style.width = width;
        this.placeholderElement.style.height = height;

        node.parentNode.insertBefore(this.placeholderElement, node.nextSibling);
    }

    /**
     * Removes placehoder element.
     */
    public onNodeDragEnd(): void {
        this.placeholderElement.parentElement.removeChild(this.placeholderElement);
    }

    /**
     * Places placeholder element before target.
     */
    public onAcceptNodeBefore(node: HTMLElement, acceptingNode: HTMLElement): void {
        acceptingNode.parentNode.insertBefore(this.placeholderElement, acceptingNode);
    }

    /**
     * Places placeholder element after target.
     */
    public onAcceptNodeAfter(node: HTMLElement, acceptingNode: HTMLElement): void {
        acceptingNode.parentNode.insertBefore(this.placeholderElement, acceptingNode.nextSibling);
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (!this.selection()) {
            return;
        }

        switch (event.keyCode) {
            case 37:
                this.selection().moveNodeLeft();
                break;
            case 39:
                this.selection().moveNodeRight();
                break;
            default:
        }
    }

    @OnDestroyed()
    public dispose(): void {
        document.removeEventListener(Events.KeyDown, this.onKeyDown.bind(this), false);
    }

    public isSelected(page: NavigationItemViewModel): boolean {
        const selectedNavItem = this.selection();
        return selectedNavItem?.key === page.key;
    }
}
