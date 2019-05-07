import * as ko from "knockout";
import template from "./tableOfContentsEditor.html";
import { NavigationItemContract } from "@paperbits/common/navigation";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
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
export class TableOfContentsEditor {
    public readonly navigationItemTitle: ko.Observable<string>;
    public readonly headingOptions: ko.ObservableArray<IHeadingOption>;
    public readonly selectedOption: ko.Observable<number>;

    constructor(private readonly tableOfContentsModelBinder: TableOfContentsModelBinder) {
        this.applyChanges = this.applyChanges.bind(this);
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
        this.navigationItemTitle = ko.observable<string>("Click to select navigation item...");
    }

    @Param()
    public model: TableOfContentsModel;

    @Event()
    public onChange: (model: TableOfContentsModel) => void;

    @OnMounted()
    public initialize(): void {
        this.selectedOption(this.model.maxHeading || 1);

        if (this.model.title) {
            this.navigationItemTitle(this.model.title);
        }

        this.selectedOption.subscribe(this.applyChanges);
    }

    public async onNavigationItemChange(navigationItem: NavigationItemContract): Promise<void> {
        const contract: TableOfContentsContract = {
            type: "table-of-contents",
            title: this.model.title,
            navigationItemKey: navigationItem.key
        };

        const model = await this.tableOfContentsModelBinder.contractToModel(contract);
        this.model = model;
        this.navigationItemTitle(navigationItem.label);
        this.applyChanges();
    }

    public applyChanges(): void {
        this.model.maxHeading = this.selectedOption();
        this.onChange(this.model);
    }
}
