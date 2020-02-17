/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as ko from "knockout";
import template from "./menu.html";
import horizontalMenuTemplate from "./horizontalMenu.html";
import verticalMenuTemplate from "./verticalMenu.html";
import { Component } from "@paperbits/common/ko/decorators";
import { MenuItemViewModel } from "./menuItemViewModel";
import { StyleModel } from "@paperbits/common/styles";


@Component({
    selector: "menu",
    template: template,
    childTemplates: {
        horizontalMenu: horizontalMenuTemplate,
        verticalMenu: verticalMenuTemplate
    }
})
export class MenuViewModel {
    public readonly isEmpty: ko.Computed<boolean>;
    public readonly nodes: ko.ObservableArray<MenuItemViewModel>;
    public readonly layout: ko.Observable<string>;
    public readonly css: ko.Computed<any>;
    public readonly roles: ko.ObservableArray<string>;
    public readonly styles: ko.Observable<StyleModel>;

    constructor() {
        this.nodes = ko.observableArray<MenuItemViewModel>([]);
        this.layout = ko.observable("vertical");
        this.roles = ko.observableArray<string>();
        this.styles = ko.observable();
        this.isEmpty = ko.pureComputed(() => {
            return false;
            // const nodes = this.nodes();
            // return !nodes || nodes.length === 0;
        });

        this.css = ko.pureComputed(() => {
            return {
                "nav-horizontal": this.layout() === "horizontal",
                "nav-vertical": this.layout() === "vertical",
                "nav-full": this.layout() === "sitemap"
            };
        });
    }
}