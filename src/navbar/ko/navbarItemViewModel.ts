import * as ko from "knockout";

export class NavbarItemViewModel {
    public label: ko.Observable<string>;
    public url: ko.Observable<string>;
    public isActive: ko.Observable<boolean>;
    public nodes: ko.ObservableArray<NavbarItemViewModel>;

    constructor(label: string, url?: string) {
        this.label = ko.observable<string>(label);
        this.url = ko.observable<string>(url);
        this.isActive = ko.observable<boolean>();
        this.nodes = ko.observableArray<NavbarItemViewModel>();
    }
}
