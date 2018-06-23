import * as ko from "knockout";
import { IWidgetOrder } from "@paperbits/common/editing";

export class WidgetItem {
    public css: string;
    public displayName: string;
    public widgetOrder: IWidgetOrder;
    public element: HTMLElement;
    public hasFocus: KnockoutObservable<boolean>;

    constructor() {
        this.hasFocus = ko.observable<boolean>();
    }
}
