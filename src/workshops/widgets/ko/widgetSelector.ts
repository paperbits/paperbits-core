import * as ko from "knockout";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { Component, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { Logger } from "@paperbits/common/logging";
import { IWidgetService, WidgetModel } from "@paperbits/common/widgets";
import { WidgetItem } from "./widgetItem";
import template from "./widgetSelector.html";
import { ViewManager } from "@paperbits/common/ui";
import { IWidgetOrder } from "@paperbits/common/editing";
import { ContentModel } from "../../../content";

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

    constructor(
        private readonly widgetService: IWidgetService,
        private readonly viewManager: ViewManager,
        private readonly logger: Logger
    ) {
        this.working = ko.observable(true);
        this.searchPattern = ko.observable<string>();
        this.categories = ko.observable<{ name: string, items: WidgetItem[] }[]>();
        this.widgetCount = ko.observable();
    }

    @Event()
    public onSelect: (widgetModel: WidgetModel) => void;

    @Event()
    public onRequest: () => string[];

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
            .map(category => ({
                name: category.name,
                items: category.items.filter(w => w.displayName.toLowerCase().includes(pattern))
            }))
            .filter(category => category.items.length > 0);

        this.categories(filteredCategories);

        const widgetCount = filteredCategories.length > 0
            ? filteredCategories.map(category => category.items.length).reduce((x, y) => x += y)
            : 0;

        this.widgetCount(widgetCount);
    }

    private async getContentPartOrders(): Promise<IWidgetOrder[]> {
        const activeLayer = this.viewManager.getActiveLayer();

        if (activeLayer !== "layout") {
            return [];
        }

        const pageContentWidgetOrder: IWidgetOrder = {
            displayName: "Page content",
            category: "Layout",
            createModel: async () => {
                const model = new ContentModel();
                model.type = "page";
                return model;
            }
        }

        return [pageContentWidgetOrder];
    }

    private async loadWidgetOrders(): Promise<void> {
        this.working(true);

        const items = new Array<WidgetItem>();
        const widgetOrders = await this.widgetService.getWidgetOrders();
        const provided = this.onRequest();

        const contentParts = await this.getContentPartOrders();

        widgetOrders.push(...contentParts);

        widgetOrders
            .filter(widgetOrder => !widgetOrder.requires || widgetOrder.requires.every(entry => provided.includes(entry)))
            .forEach(widgetOrder => {
                const widgetItem = new WidgetItem();
                widgetItem.name = widgetOrder.name;
                widgetItem.displayName = widgetOrder.displayName;
                widgetItem.css = `${widgetOrder.iconClass}`;
                widgetItem.iconUrl = widgetOrder.iconUrl;
                widgetItem.category = widgetOrder.category || "";
                widgetItem.createModel = widgetOrder.createModel

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
        const widgetModel = await widgetItem.createModel();

        this.onSelect(widgetModel);
        this.logger.trackEvent("WidgetAdded", { name: widgetItem.name });
    }
}
