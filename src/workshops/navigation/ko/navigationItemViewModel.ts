import * as ko from "knockout";
import { NavigationItemContract } from "@paperbits/common/navigation";

export class NavigationItemViewModel {
    public key: string;
    public label: KnockoutObservable<string>;
    public permalinkKey: KnockoutObservable<string>;
    public parent: NavigationItemViewModel;
    public nodes: KnockoutObservableArray<NavigationItemViewModel>;
    public collapsed: KnockoutObservable<boolean>;
    public dragged: KnockoutObservable<boolean>;
    public hasFocus: KnockoutObservable<boolean>;
    public onUpdate: KnockoutSubscribable<void>;

    constructor(navitem: NavigationItemContract) {
        this.moveNodeLeft = this.moveNodeLeft.bind(this);
        this.moveNodeRight = this.moveNodeRight.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.canAccept = this.canAccept.bind(this);
        this.insertBefore = this.insertBefore.bind(this);
        this.insertAfter = this.insertAfter.bind(this);

        this.key = navitem.key;
        this.label = ko.observable<string>(navitem.label);

        this.nodes = ko.observableArray<NavigationItemViewModel>([]);
        this.collapsed = ko.observable<boolean>(false);
        this.dragged = ko.observable<boolean>(false);
        this.hasFocus = ko.observable<boolean>(false);
        this.onUpdate = new ko.subscribable<void>();

        document.addEventListener("keydown", this.onKeyDown, false);

        this.permalinkKey = ko.observable<string>(navitem.permalinkKey);
        this.permalinkKey.subscribe(() => this.onUpdate.notifySubscribers());
        this.label.subscribe(() => this.onUpdate.notifySubscribers());
    }

    private isSiblingNode(node: NavigationItemViewModel): boolean {
        return this.parent && this.parent.nodes.indexOf(node) >= 0;
    }

    private isChildNode(node: NavigationItemViewModel): boolean {
        return this.nodes.indexOf(node) >= 0;
    }

    private isUncleNode(node: NavigationItemViewModel): boolean {
        return this.parent && this.parent.parent && this.parent.parent.nodes.indexOf(node) >= 0 && this.parent !== node;
    }

    private moveNodeLeft(): void {
        if (!this.parent.parent) {
            return;
        }

        this.parent.nodes.remove(this);
        const ownIndex = this.parent.parent.nodes.indexOf(this.parent);
        this.parent.parent.nodes.splice(ownIndex + 1, 0, this);
        this.parent = this.parent.parent;

        this.onUpdate.notifySubscribers();
    }

    private moveNodeRight(): void {
        const index = this.parent.nodes().indexOf(this);

        if (index === 0) {
            return;
        }

        const previousSibling = this.parent.nodes()[index - 1];
        this.parent.nodes.remove(this);
        this.parent = previousSibling;
        previousSibling.nodes.push(this);

        this.onUpdate.notifySubscribers();
    }

    public canAccept(node: NavigationItemViewModel): boolean {
        return this.isSiblingNode(node) || this.isChildNode(node) || this.isUncleNode(node);
    }

    public insertBefore(node: NavigationItemViewModel): void {
        if (this.parent && this.isSiblingNode(node) || this.isUncleNode(node) || this.isChildNode(node)) {
            node.parent.nodes.remove(node);
            const ownIndex = this.parent.nodes.indexOf(this);
            this.parent.nodes.splice(ownIndex, 0, node);
            node.parent = this.parent;

            this.onUpdate.notifySubscribers();
        }
    }

    public insertAfter(node: NavigationItemViewModel): void {
        if (this.parent && this.isSiblingNode(node) || this.isUncleNode(node)) {
            node.parent.nodes.remove(node);
            const ownIndex = this.parent.nodes.indexOf(this);
            this.parent.nodes.splice(ownIndex + 1, 0, node);
            node.parent = this.parent;

            this.onUpdate.notifySubscribers();
        }

        if (this.parent && this.isChildNode(node)) {
            node.parent.nodes.remove(node);
            const ownIndex = this.parent.nodes.indexOf(this);
            this.parent.nodes.splice(ownIndex, 0, node);
            node.parent = this.parent;

            this.onUpdate.notifySubscribers();
        }
    }

    public toggleCollapsed(): void {
        this.collapsed(!this.collapsed());
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (!this.hasFocus()) {
            return;
        }

        switch (event.keyCode) {
            case 37:
                this.moveNodeLeft();
                break;
            case 39:
                this.moveNodeRight();
                break;
            default:
        }
    }

    public remove(): void {
        this.parent.nodes.remove(this);
        this.parent.onUpdate.notifySubscribers();
    }

    public toContract(): NavigationItemContract {
        let navigationItems = null;

        if (this.nodes().length > 0) {
            navigationItems = [];
            this.nodes().forEach(x => navigationItems.push(x.toContract()));
        }

        const navigationItem: NavigationItemContract = {
            key: this.key,
            label: this.label(),
            permalinkKey: this.permalinkKey(),
            navigationItems: navigationItems
        };

        return navigationItem;
    }
}
