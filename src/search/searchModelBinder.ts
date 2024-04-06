import { Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { SearchInputModel } from "./searchInputModel";
import { SearchContract } from "./searchContract";


export class SearchModelBinder implements IModelBinder<SearchInputModel> {
    constructor(
    ) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "search";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SearchInputModel;
    }

    public async contractToModel(searchContract: SearchContract): Promise<SearchInputModel> {
        return new SearchInputModel();
    }

    public modelToContract(searchModel: SearchInputModel): Contract {
        const searchConfig: SearchContract = {
            type: "search"
        };

        return searchConfig;
    }
}
