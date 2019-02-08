import * as ko from "knockout";
import template from "./widgetSelector.html";
import { WidgetItem } from "./widgetItem";
import { IWidgetService, WidgetModel } from "@paperbits/common/widgets";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";


@Component({
    selector: "widget-selector",
    template: template,
    injectable: "widgetSelector"
})
export class WidgetSelector {
    public readonly widgets: ko.Observable<WidgetItem[]>;
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
        this.widgets = ko.observable<WidgetItem[]>();
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
            .filter(x => !x.requires || x.requires.every(y => provided.contains(y)))
            .forEach((widgetOrder) => {
                const widgetItem = new WidgetItem();

                widgetItem.css = `${widgetOrder.iconClass}`;
                widgetItem.displayName = widgetOrder.displayName;
                widgetItem.widgetOrder = widgetOrder;

                items.push(widgetItem);
            });

        this.widgets(items);
        this.working(false);
    }

    public async selectWidget(widgetItem: WidgetItem): Promise<void> {
        const model = await widgetItem.widgetOrder.createModel();
        this.onSelect(model);
    }
}
