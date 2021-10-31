import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import { NavigationItemModel } from "@paperbits/common/navigation";


export class NavigationItemViewModel {
    public key: string;
    public label: ko.Observable<string>;
    public displayLabel: ko.Computed<string>;
    public targetKey: ko.Observable<string>;
    public targetUrl: ko.Observable<string>;
    public targetWindow: ko.Observable<string>;
    public triggerEvent: ko.Observable<string>;
    public anchor: ko.Observable<string>;
    public parent: NavigationItemViewModel;
    public nodes: ko.ObservableArray<NavigationItemViewModel>;
    public collapsed: ko.Observable<boolean>;
    public dragged: ko.Observable<boolean>;
    public onUpdate: ko.Subscribable<void>;

    constructor(navitem: NavigationItemModel) {
        this.moveNodeLeft = this.moveNodeLeft.bind(this);
        this.moveNodeRight = this.moveNodeRight.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.canAccept = this.canAccept.bind(this);
        this.insertBefore = this.insertBefore.bind(this);
        this.insertAfter = this.insertAfter.bind(this);

        this.key = navitem.key;
        this.label = ko.observable<string>(navitem.label);
        this.label.subscribe(() => this.notify());
        this.displayLabel = ko.pureComputed(() => this.label() || "< No label >");
        this.nodes = ko.observableArray<NavigationItemViewModel>([]);
        this.collapsed = ko.observable<boolean>(false);
        this.dragged = ko.observable<boolean>(false);
        this.onUpdate = new ko.subscribable<void>();
        this.targetKey = ko.observable<string>(navitem.targetKey);
        this.targetKey.subscribe(() => this.notify());
        this.targetUrl = ko.observable<string>(navitem.targetUrl);
        this.targetWindow = ko.observable<string>(navitem.targetWindow);
        this.targetWindow.subscribe(() => this.notify());
        this.anchor = ko.observable<string>(navitem.anchor);
        this.anchor.subscribe(() => this.notify());
        this.triggerEvent = ko.observable<string>(navitem.triggerEvent);
        this.triggerEvent.subscribe(() => this.notify());
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

    public moveNodeLeft(): void {
        if (!this.parent.parent) {
            return;
        }

        this.parent.nodes.remove(this);
        const ownIndex = this.parent.parent.nodes.indexOf(this.parent);
        this.parent.parent.nodes.splice(ownIndex + 1, 0, this);
        this.parent = this.parent.parent;

        this.notify();
    }

    public moveNodeRight(): void {
        const index = this.parent.nodes().indexOf(this);

        if (index === 0) {
            return;
        }

        const previousSibling = this.parent.nodes()[index - 1];
        this.parent.nodes.remove(this);
        this.parent = previousSibling;
        previousSibling.nodes.push(this);

        this.notify();
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

            this.notify();
        }
    }

    public insertAfter(node: NavigationItemViewModel): void {
        if (this.parent && this.isSiblingNode(node) || this.isUncleNode(node)) {
            node.parent.nodes.remove(node);
            const ownIndex = this.parent.nodes.indexOf(this);
            this.parent.nodes.splice(ownIndex + 1, 0, node);
            node.parent = this.parent;

            this.notify();
        }

        if (this.parent && this.isChildNode(node)) {
            node.parent.nodes.remove(node);
            const ownIndex = this.parent.nodes.indexOf(this);
            this.parent.nodes.splice(ownIndex, 0, node);
            node.parent = this.parent;

            this.notify();
        }
    }

    public toggleCollapsed(): void {
        this.collapsed(!this.collapsed());
    }

    public onKeyDown(event: KeyboardEvent): void {
        // if (!this.hasFocus()) {
        //     return;
        // }

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
        this.notify();
    }

    public addChild(): NavigationItemViewModel {
        const navitemModel = new NavigationItemModel();
        navitemModel.key = Utils.guid();
        navitemModel.label = "< New >";

        const node = new NavigationItemViewModel(navitemModel);
        node.parent = this;

        this.nodes.push(node);

        return node;
    }

    private notify(): void {
        this.onUpdate.notifySubscribers();

        if (this.parent) {
            this.parent.notify();
        }
    }

    public toString(): string {
        return this.label();
    }
}
