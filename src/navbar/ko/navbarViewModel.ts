import * as ko from "knockout";
import template from "./navbar.html";
import { Component } from "@paperbits/common/ko/decorators";
import { NavbarItemViewModel } from "./navbarItemViewModel";
import { StyleModel } from "@paperbits/common/styles";


@Component({
    selector: "navbar",
    template: template
})
export class NavbarViewModel {
    public navigationRoot: ko.Observable<NavbarItemViewModel>;
    public pictureSourceUrl: ko.Observable<string>;
    public pictureWidth: ko.Observable<string | number>;
    public pictureHeight: ko.Observable<string | number>;    
    public styles: ko.Observable<StyleModel>;

    constructor() {
        this.navigationRoot = ko.observable<NavbarItemViewModel>();
        this.pictureSourceUrl = ko.observable<string>();
        this.pictureWidth = ko.observable<string | number>();
        this.pictureHeight = ko.observable<string | number>();        
        this.styles = ko.observable<StyleModel>();
    }
}