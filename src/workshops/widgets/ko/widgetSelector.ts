import * as ko from "knockout";
import template from "./widgetSelector.html";
import { WidgetItem } from "./widgetItem";
import { IResourceSelector } from "@paperbits/common/ui/IResourceSelector";
import { IWidgetService } from "@paperbits/common/widgets/IWidgetService";
import { IViewManager } from "@paperbits/common/ui";
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "widget-selector",
    template: template,
    injectable: "widgetSelector"
})
export class WidgetSelector implements IResourceSelector<Object> {
    public readonly onResourceSelected: (widgetModel: Object) => void;

    public readonly widgets: KnockoutObservable<Array<WidgetItem>>;
    public readonly working: KnockoutObservable<boolean>;

    constructor(
        private readonly viewManager: IViewManager,
        private readonly widgetService: IWidgetService,
        private readonly onSelect: (widgetModel: Object) => void
    ) {
        // initialization...
        this.onResourceSelected = onSelect;

        // rebinding...
        this.selectWidget = this.selectWidget.bind(this);

        // setting up...
        this.working = ko.observable(true);
        this.widgets = ko.observable<Array<WidgetItem>>();

        this.loadWidgetOrders();
    }

    private async loadWidgetOrders(): Promise<void> {
        this.working(true);

        var items = new Array<WidgetItem>();

        let widgetOrders = await this.widgetService.getWidgetOrders();

        widgetOrders.forEach((widgetOrder) => {
            let widgetItem = new WidgetItem();

            widgetItem.css = `${widgetOrder.iconClass}`,
                widgetItem.displayName = widgetOrder.displayName;
            widgetItem.widgetOrder = widgetOrder;

            items.push(widgetItem);
        });

        this.widgets(items);
        this.working(false);
    }

    public async selectWidget(widgetItem: WidgetItem): Promise<void> {
        const model = await widgetItem.widgetOrder.createModel();
        this.onResourceSelected(model);
    }

    public closeEditor(): void {
        this.viewManager.closeWidgetEditor();
    }
}