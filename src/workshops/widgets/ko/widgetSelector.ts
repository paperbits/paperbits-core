import * as ko from "knockout";
import template from "./widgetSelector.html";
import { WidgetItem } from "./widgetItem";
import { IWidgetService, WidgetModel } from "@paperbits/common/widgets";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "widget-selector",
    template: template
})
export class WidgetSelector {
    private originalCategories: any;
    public readonly filteredCategories: ko.Observable<{ name: string, items: WidgetItem[] }[]>;
    public readonly categories: ko.Observable<{ name: string, items: WidgetItem[] }[]>;
    public readonly widgetCount: ko.Observable<number>;
    public readonly working: ko.Observable<boolean>;
    public readonly searchPattern: ko.Observable<string>;


    @Event()
    public onSelect: (widgetModel: WidgetModel) => void;

    @Event()
    public onRequest: () => string[];

    constructor(private readonly widgetService: IWidgetService) {
        this.working = ko.observable(true);
        this.searchPattern = ko.observable<string>();
        this.categories = ko.observable<{ name: string, items: WidgetItem[] }[]>();
        this.widgetCount = ko.observable();
    }

    @OnMounted()
    public initialize(): void {
        this.loadWidgetOrders();

        this.searchPattern
            .extend(ChangeRateLimit)
            .subscribe(this.searchWidgets);
    }

    public async searchWidgets(pattern: string): Promise<void> {
        pattern = pattern.toLowerCase();

        const filteredCategories = this.originalCategories
            .map(x => ({
                name: x.name,
                items: x.items.filter(w => w.displayName.toLowerCase().includes(pattern))
            }))
            .filter(x => x.items.length > 0);

        this.categories(filteredCategories);

        const widgetCount = filteredCategories.length > 0
            ? filteredCategories.map(x => x.items.length).reduce((x, y) => x += y)
            : 0;

        this.widgetCount(widgetCount);
    }

    private async loadWidgetOrders(): Promise<void> {
        this.working(true);

        const items = new Array<WidgetItem>();
        const widgetOrders = await this.widgetService.getWidgetOrders();
        const provided = this.onRequest();

        widgetOrders
            .filter(x => !x.requires || x.requires.every(y => provided.includes(y)))
            .forEach((widgetOrder) => {
                const widgetItem = new WidgetItem();

                widgetItem.css = `${widgetOrder.iconClass}`;
                widgetItem.iconUrl = widgetOrder.iconUrl;
                widgetItem.displayName = widgetOrder.displayName;
                widgetItem.category = widgetOrder.category || "";
                widgetItem.widgetOrder = widgetOrder;

                items.push(widgetItem);
            });

        const groupsObj = items.reduce((result, item) => {
            (result[item["category"]] = result[item["category"]] || []).push(item);
            return result;
        }, {});

        const groups = Object.keys(groupsObj).map(category => {
            return { name: category, items: groupsObj[category] };
        });

        this.originalCategories = groups;

        this.categories(this.originalCategories);
        this.working(false);
    }

    public async selectWidget(widgetItem: WidgetItem): Promise<void> {
        const model = await widgetItem.widgetOrder.createModel();
        this.onSelect(model);
    }
}
