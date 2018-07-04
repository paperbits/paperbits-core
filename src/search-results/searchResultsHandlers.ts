import { IWidgetOrder } from '@paperbits/common/editing';
import { IWidgetHandler } from '@paperbits/common/editing';
import { SearchResultsModel } from './searchResultsModel';

export class SearchResultsHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "search-results",
            displayName: "Search results",
            iconClass: "paperbits-cheque-3",
            requires: ["scripts"],
            createModel: async () => new SearchResultsModel()
        }

        return widgetOrder;
    }
}