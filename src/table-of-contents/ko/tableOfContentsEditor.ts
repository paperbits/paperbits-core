import * as ko from "knockout";
import template from "./tableOfContentsEditor.html";
import { IViewManager } from "@paperbits/common/ui";
import { IWidgetEditor } from "@paperbits/common/widgets";
import { NavigationItemContract } from "@paperbits/common/navigation";
import { Component } from "../../ko/decorators/component.decorator";
import { TableOfContentsModel } from "../tableOfContentsModel";
import { TableOfContentsModelBinder } from "../tableOfContentsModelBinder";
import { TableOfContentsContract } from "../tableOfContentsContract";


@Component({
    selector: "table-of-contents-editor",
    template: template,
    injectable: "tableOfContentsEditor"
})
export class TableOfContentsEditor implements IWidgetEditor {
    private tableOfContentsModel: TableOfContentsModel;
    private applyChangesCallback: (updatedModel?) => void;

    public readonly navigationItemTitle: KnockoutObservable<string>;

    constructor(private readonly tableOfContentsModelBinder: TableOfContentsModelBinder) {
        this.onNavigationItemChange = this.onNavigationItemChange.bind(this);

        this.navigationItemTitle = ko.observable<string>("Click to select navigation item...");
    }

    public setWidgetModel(tableOfContents: TableOfContentsModel, applyChangesCallback?: (updatedModel?) => void): void {
        this.tableOfContentsModel = tableOfContents;
        this.applyChangesCallback = applyChangesCallback;
    }

    public async onNavigationItemChange(navigationItem: NavigationItemContract): Promise<void> {
        const contract: TableOfContentsContract = {
            title: this.tableOfContentsModel.title,
            navigationItemKey: navigationItem.key
        };

        const model = await this.tableOfContentsModelBinder.contractToModel(contract);

        this.navigationItemTitle(navigationItem.label);

        this.applyChangesCallback(model);
    }
}
