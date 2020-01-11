import { Contract } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { SearchModel } from "./searchModel";
import { SearchContract } from "./searchContract";


export class SearchModelBinder implements IModelBinder<SearchModel> {
    constructor(
    ) {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "search";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof SearchModel;
    }

    public async contractToModel(searchContract: SearchContract): Promise<SearchModel> {
        return new SearchModel();
    }

    public modelToContract(searchModel: SearchModel): Contract {
        const searchConfig: SearchContract = {
            type: "search"
        };

        return searchConfig;
    }
}
