/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as ko from "knockout";
import template from "./tableOfContents.html";
import { NavigationItemModel } from "@paperbits/common/navigation";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "table-of-contents",
    template: template
})
export class TableOfContentsViewModel {
    public readonly isEmpty: ko.Computed<boolean>;
    public readonly nodes: ko.ObservableArray<NavigationItemModel>;

    constructor() {
        this.nodes = ko.observableArray<NavigationItemModel>([]);
        this.isEmpty = ko.pureComputed(() => {
            const nodes = this.nodes();
            return !nodes || nodes.length === 0;
        });
    }
}