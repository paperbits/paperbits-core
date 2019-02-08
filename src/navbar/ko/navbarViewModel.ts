import * as ko from "knockout";
import template from "./navbar.html";
import { Component } from "@paperbits/common/ko/decorators";
import { NavbarItemViewModel } from "./navbarItemViewModel";

@Component({
    selector: "navbar",
    template: template
})
export class NavbarViewModel {
    public navigationRoot: ko.Observable<NavbarItemViewModel>;
    public pictureSourceUrl: ko.Observable<string>;

    constructor() {
        this.navigationRoot = ko.observable<NavbarItemViewModel>();
        this.pictureSourceUrl = ko.observable<string>();
    }
}