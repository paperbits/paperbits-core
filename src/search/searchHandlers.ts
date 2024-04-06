import { IWidgetHandler } from "@paperbits/common/editing";
import { SearchInputModel } from "./searchInputModel";

export class SearchHandlers implements IWidgetHandler<SearchInputModel> {
    public async getWidgetModel(): Promise<SearchInputModel> {
        return new SearchInputModel();
    }
}