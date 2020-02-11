import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { TableOfContentsModel } from "./tableOfContentsModel";

export class TableOfContentsHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "table-of-contents",
            displayName: "Table of contents",
            iconClass: "paperbits-cheque-3",
            requires: ["html", "js"],
            createModel: async () => new TableOfContentsModel()
        };

        return widgetOrder;
    }
}