import * as ko from "knockout";
import template from "./navbar.html";
import { Component } from "@paperbits/knockout/decorators";
import { NavbarItemViewModel } from "./navbarItemViewModel";

@Component({
    selector: "navbar",
    template: template
})
export class NavbarViewModel {
    public navigationRoot: KnockoutObservable<NavbarItemViewModel>;
    public pictureSourceUrl: KnockoutObservable<string>;

    constructor() {
        this.navigationRoot = ko.observable<NavbarItemViewModel>();
        this.pictureSourceUrl = ko.observable<string>();
    }
}