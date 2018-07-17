import { Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { SearchResultsModel } from "./searchResultsModel";
import { SearchResultsContract } from "./searchResultsContract";


export class SearchResultsModelBinder implements IModelBinder {
    constructor(
    ) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "search-results";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SearchResultsModel;
    }

    public async contractToModel(searchResultContract: SearchResultsContract): Promise<SearchResultsModel> {
        return new SearchResultsModel();
    }

    public modelToContract(searchResultModel: SearchResultsModel): Contract {
        const searchResultConfig: SearchResultsContract = {
            object: "block",
            type: "search-results"
        };

        return searchResultConfig;
    }
}
