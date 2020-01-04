import * as ko from "knockout";
import template from "./widgetSelector.html";
import { WidgetItem } from "./widgetItem";
import { IWidgetService, WidgetModel } from "@paperbits/common/widgets";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "widget-selector",
    template: template
})
export class WidgetSelector {
    public readonly categories: ko.Observable<{name: string, items: WidgetItem[]}[]>;
    public readonly working: ko.Observable<boolean>;

    @Event()
    public onSelect: (widgetModel: WidgetModel) => void;

    @Event()
    public onRequest: () => string[];

    constructor(private readonly widgetService: IWidgetService) {
        // rebinding...
        this.onMounted = this.onMounted.bind(this);
        this.selectWidget = this.selectWidget.bind(this);

        // setting up...
        this.working = ko.observable(true);
        this.categories = ko.observable<{name: string, items: WidgetItem[]}[]>();
    }

    @OnMounted()
    public onMounted(): void {
        this.loadWidgetOrders();
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
            return {name: category, items: groupsObj[category]};
        });
        
        this.categories(groups);
        this.working(false);
    }

    public async selectWidget(widgetItem: WidgetItem): Promise<void> {
        const model = await widgetItem.widgetOrder.createModel();
        this.onSelect(model);
    }
}
