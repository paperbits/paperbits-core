import { IWidgetOrder } from "@paperbits/common/editing";

export class WidgetItem {
    public css: string;
    public iconUrl: string;
    public displayName: string;
    public category?: string;
    public widgetOrder: IWidgetOrder;
    public element: HTMLElement;
}
