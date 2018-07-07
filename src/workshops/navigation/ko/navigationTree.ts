import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import { NavigationItemContract } from "@paperbits/common/navigation/navigationItemContract";
import { NavigationItemViewModel } from "./navigationItemViewModel";

export class NavigationTree {  // TODO: This should be refactored into ModelBinder
    private placeholderElement: HTMLElement;

    public nodes: KnockoutObservableArray<NavigationItemViewModel>;
    public selectedNode: KnockoutObservable<NavigationItemViewModel>;
    public focusedNode: KnockoutObservable<NavigationItemViewModel>;
    public onUpdate: KnockoutSubscribable<Array<NavigationItemContract>>;

    constructor(items: Array<NavigationItemContract>) {
        this.onFocusChange = this.onFocusChange.bind(this);
        this.addNode = this.addNode.bind(this);
        this.onNodeDragStart = this.onNodeDragStart.bind(this);
        this.onNodeDragEnd = this.onNodeDragEnd.bind(this);
        this.onNullPointerMove = this.onNullPointerMove.bind(this);
        this.onAcceptNodeBefore = this.onAcceptNodeBefore.bind(this);
        this.onAcceptNodeAfter = this.onAcceptNodeAfter.bind(this);
        this.dispatchUpdates = this.dispatchUpdates.bind(this);

        const nodes = new Array<NavigationItemViewModel>();
        items.forEach(x => nodes.push(this.modelToViewModel(x)));

        this.nodes = ko.observableArray<NavigationItemViewModel>(nodes);
        this.selectedNode = ko.observable<NavigationItemViewModel>();
        this.focusedNode = ko.observable<NavigationItemViewModel>();
        this.onUpdate = new ko.subscribable<Array<NavigationItemContract>>();

        this.placeholderElement = document.createElement("div");
        this.placeholderElement.className = "placeholder";
        this.placeholderElement.onmousemove = this.onNullPointerMove;
    }

    private onNullPointerMove(event: MouseEvent): void {
        event.stopPropagation();
    }

    private onFocusChange(node: NavigationItemViewModel): void {
        this.focusedNode(node);
    }

    private dispatchUpdates(): void {
        const items = new Array<NavigationItemContract>();

        this.nodes().forEach(n => items.push(n.toContract()));
        this.onUpdate.notifySubscribers(items);
    }

    private modelToViewModel(navItem: NavigationItemContract): NavigationItemViewModel {
        const viewModel = new NavigationItemViewModel(navItem);

        viewModel.hasFocus.subscribe((focused) => {
            if (focused) {
                this.onFocusChange(viewModel);
            }
        });

        viewModel.onUpdate.subscribe(this.dispatchUpdates);

        if (navItem.navigationItems) {
            navItem.navigationItems.forEach(child => {
                let childNode = this.modelToViewModel(child);
                childNode.parent = viewModel;
                viewModel.nodes.push(childNode);
            });
        }

        return viewModel;
    }

    public addNode(label: string): NavigationItemViewModel {
        const navitem: NavigationItemContract = {
            key: Utils.guid(),
            label: label
        }

        const node = new NavigationItemViewModel(navitem);

        const focusedNode = this.focusedNode();

        if (focusedNode) {
            node.parent = focusedNode;
            focusedNode.nodes.push(node);
        }
        else {
            this.nodes.push(node);
        }

        node.hasFocus.subscribe((focused) => {
            if (focused) {
                this.onFocusChange(node);
            }
        });

        node.onUpdate.subscribe(this.dispatchUpdates);

        this.dispatchUpdates();

        return node;
    }

    public getNavigationItems(): Array<NavigationItemContract> {
        const navigationItems = [];

        this.nodes().forEach(x => navigationItems.push(x.toContract()));

        return navigationItems;
    }

    public onNodeDragStart(payload: any, node: HTMLElement): void {
        const width = node.clientWidth + "px";
        const height = node.clientHeight + "px";

        this.placeholderElement.style.width = width;
        this.placeholderElement.style.height = height;

        node.parentNode.insertBefore(this.placeholderElement, node.nextSibling);
    }

    public onNodeDragEnd(widget: HTMLElement): void {
        this.placeholderElement.parentElement.removeChild(this.placeholderElement);
    }

    private onAcceptNodeBefore(node: HTMLElement, acceptingNode: HTMLElement): void {
        acceptingNode.parentNode.insertBefore(this.placeholderElement, acceptingNode);
    }

    private onAcceptNodeAfter(node: HTMLElement, acceptingNode: HTMLElement): void {
        acceptingNode.parentNode.insertBefore(this.placeholderElement, acceptingNode.nextSibling);
    }
}
