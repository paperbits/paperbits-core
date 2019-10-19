import * as ko from "knockout";

/**
 * Menu item view model.
 */
export class MenuItemViewModel {
    public readonly label: ko.Observable<string>;
    public readonly url: ko.Observable<string>;
    public readonly nodes: ko.ObservableArray<MenuItemViewModel>;
    public readonly isActive: ko.Observable<boolean>;
    public readonly expanded: ko.Observable<boolean>;
    public readonly level: ko.Observable<number>;

    constructor() {
        this.label = ko.observable();
        this.url = ko.observable();
        this.level = ko.observable();
        this.nodes = ko.observableArray([]);
        this.isActive = ko.observable(false);
        this.expanded = ko.observable(false);
    }

    public toggle(): void {
        this.expanded(!this.expanded());
    }
}