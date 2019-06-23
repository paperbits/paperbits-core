import * as ko from "knockout";
import { IWidgetOrder } from "@paperbits/common/editing";

export class WidgetItem {
    public css: string;
    public displayName: string;
    public category?: string;
    public widgetOrder: IWidgetOrder;
    public element: HTMLElement;
    public hasFocus: ko.Observable<boolean>;

    constructor() {
        this.hasFocus = ko.observable<boolean>();
    }
}
