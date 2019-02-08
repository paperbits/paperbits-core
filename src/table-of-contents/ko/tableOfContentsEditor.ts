import * as ko from "knockout";
import template from "./tableOfContentsEditor.html";
import { IViewManager } from "@paperbits/common/ui";
import { IWidgetEditor } from "@paperbits/common/widgets";
import { NavigationItemContract } from "@paperbits/common/navigation";
import { Component } from "@paperbits/common/ko/decorators";
import { TableOfContentsModel } from "../tableOfContentsModel";
import { TableOfContentsModelBinder } from "../tableOfContentsModelBinder";
import { TableOfContentsContract } from "../tableOfContentsContract";

interface IHeadingOption {
    label: string;
    value: number;
}

@Component({
    selector: "table-of-contents-editor",
    template: template,
    injectable: "tableOfContentsEditor"
})
export class TableOfContentsEditor implements IWidgetEditor {
    private tableOfContentsModel: TableOfContentsModel;
    private applyChangesCallback: (updatedModel?) => void;

    public readonly navigationItemTitle: ko.Observable<string>;
    public readonly headingOptions: ko.ObservableArray<IHeadingOption>;
    public selectedOption: ko.Observable<number>;

    constructor(private readonly tableOfContentsModelBinder: TableOfContentsModelBinder) {        
        this.onChange = this.onChange.bind(this);
        this.selectedOption = ko.observable();
        this.headingOptions = ko.observableArray<IHeadingOption>([
            { label: "Heading 1", value: 1 },
            { label: "Heading 2", value: 2 },
            { label: "Heading 3", value: 3 },
            { label: "Heading 4", value: 4 },
            { label: "Heading 5", value: 5 },
            { label: "Heading 6", value: 6 }
        ]);
        this.onNavigationItemChange = this.onNavigationItemChange.bind(this);
        this.selectedOption.subscribe(this.onChange);

        this.navigationItemTitle = ko.observable<string>("Click to select navigation item...");
    }

    public setWidgetModel(tableOfContents: TableOfContentsModel, applyChangesCallback?: (updatedModel?) => void): void {
        this.selectedOption(tableOfContents && tableOfContents.maxHeading || 1);
        if (tableOfContents && tableOfContents.title) {
            this.navigationItemTitle(tableOfContents.title);            
        }
        this.tableOfContentsModel = tableOfContents;
        this.applyChangesCallback = applyChangesCallback;
    }

    public async onNavigationItemChange(navigationItem: NavigationItemContract): Promise<void> {
        const contract: TableOfContentsContract = {
            title: this.tableOfContentsModel.title,
            navigationItemKey: navigationItem.key
        };

        const model = await this.tableOfContentsModelBinder.contractToModel(contract);
        this.tableOfContentsModel = model;
        this.navigationItemTitle(navigationItem.label);
        this.onChange();
    }

    public onChange(): void {
        if (!this.applyChangesCallback || !this.tableOfContentsModel) {
            return;
        }

        this.tableOfContentsModel.maxHeading = this.selectedOption();
        this.applyChangesCallback(this.tableOfContentsModel);
    }
}
