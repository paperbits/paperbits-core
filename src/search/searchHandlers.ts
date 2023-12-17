import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { SearchModel } from "./searchModel";

export class SearchHandlers implements IWidgetHandler<SearchModel> {
    public async getWidgetOrder(): Promise<IWidgetOrder<SearchModel>> {
        const widgetOrder: IWidgetOrder<SearchModel> = {
            name: "search",
            displayName: "Search website",
            iconClass: "widget-icon widget-icon-search-box",
            requires: ["html", "js"],
            createModel: async () => new SearchModel()
        };

        return widgetOrder;
    }
}