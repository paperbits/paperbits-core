import * as ko from "knockout";

export class NavbarItemViewModel {
    public label: KnockoutObservable<string>;
    public url: KnockoutObservable<string>;
    public isActive: KnockoutObservable<boolean>;
    public nodes: KnockoutObservableArray<NavbarItemViewModel>;

    constructor(label: string, url?: string) {
        this.label = ko.observable<string>(label);
        this.url = ko.observable<string>(url);
        this.isActive = ko.observable<boolean>();
        this.nodes = ko.observableArray<NavbarItemViewModel>();
    }
}
