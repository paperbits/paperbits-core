import * as ko from "knockout";
import template from "./widgetSelector.html";
import { WidgetItem } from "./widgetItem";
import { IWidgetService, WidgetModel } from "@paperbits/common/widgets";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { Style, StyleRule, StyleSheet } from "@paperbits/common/styles";

@Component({
    selector: "widget-selector",
    template: template
})
export class WidgetSelector {
    public readonly categories: ko.Observable<{name: string, items: WidgetItem[]}[]>;
    public readonly working: ko.Observable<boolean>;
    public readonly expandable: ko.Observable<Object>;
    public readonly isExpanded: ko.Observable<boolean>;

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
        this.expandable = ko.observable();
        this.isExpanded = ko.observable();
    }

    @OnMounted()
    public onMounted(): void {
        this.isExpanded(false);
        this.implementExpand(300, 400);
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

    private implementExpand(width: number, height: number): void {
        const style = new Style("expandable");
        style.addRules([new StyleRule("width", width + "px"), new StyleRule("height", height + "px")]);

        const styleSheet = new StyleSheet();
        styleSheet.styles.push(style);
        this.expandable(styleSheet);
    }

    public toggleExpand(): void {
        this.isExpanded(!this.isExpanded());
    }
}
